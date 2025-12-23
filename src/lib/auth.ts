import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // Generate username from email
          username: profile.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_"),
        };
      },
    }),
    // Credentials Provider (email/password)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // #region agent log
      console.log('[DEBUG] signIn callback triggered:', { provider: account?.provider, email: user?.email });
      const fs = require('fs');
      const signInLog = JSON.stringify({location:'auth.ts:callbacks.signIn',message:'signIn callback triggered',data:{provider:account?.provider,userEmail:user?.email,hypothesisId:'H3-H4'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1'}) + '\n';
      try { fs.appendFileSync('c:\\Full-Stack Blog Platform\\.cursor\\debug.log', signInLog); } catch(e) { console.log('[DEBUG] Failed to write log:', e); }
      // #endregion
      // For OAuth providers, handle user creation and account linking
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { accounts: true },
        });

        if (!existingUser) {
          // Generate unique username for new OAuth users
          let baseUsername = user.email!.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_");
          let username = baseUsername;
          let counter = 1;

          // Ensure username is unique
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${counter}`;
            counter++;
          }

          // Create user with username (OAuth users don't have passwords)
          await prisma.user.create({
            data: {
              email: user.email!,
              username,
              name: user.name,
              image: user.image,
              password: "", // OAuth users don't need a password
            },
          });
        } else {
          // User exists - check if Google account is already linked
          const hasGoogleAccount = existingUser.accounts.some(
            (acc) => acc.provider === "google"
          );

          if (!hasGoogleAccount) {
            // Link the Google account to the existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state as string | null,
              },
            });
            console.log('[DEBUG] Linked Google account to existing user:', existingUser.email);
          }
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }

      // For OAuth login, fetch the username from the database
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, username: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.username = dbUser.username;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
};

// Extend next-auth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    username: string;
    name?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}
