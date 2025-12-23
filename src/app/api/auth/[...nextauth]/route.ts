import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

// #region agent log - Intercept to log OAuth URLs
const fs = require('fs');

const handler = NextAuth({
  ...authOptions,
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('[NextAuth Error]', code, metadata);
    },
    warn(code) {
      console.warn('[NextAuth Warn]', code);
    },
    debug(code, metadata) {
      console.log('[NextAuth Debug]', code, metadata);
      const logEntry = JSON.stringify({location:'route.ts:debug',message:code,data:metadata,hypothesisId:'H1-H2',timestamp:Date.now(),sessionId:'debug-session',runId:'run2'}) + '\n';
      try { fs.appendFileSync('c:\\Full-Stack Blog Platform\\.cursor\\debug.log', logEntry); } catch(e) {}
    }
  }
});
// #endregion

export { handler as GET, handler as POST };

