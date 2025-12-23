"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { Camera } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    image: "",
  });

  // Initialize form data when session loads
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        bio: "",
        image: session.user.image || "",
  });
    }
  }, [session]);

  // Wait for session to load before checking auth
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    redirect("/login?callbackUrl=/dashboard/settings");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      await update();

      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
        variant: "success",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Container size="lg" className="py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600">
              Manage your account settings and profile
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Update your profile picture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar
                      src={formData.image}
                      alt={session.user.name || session.user.username}
                      size="xl"
                    />
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      onClick={() => {
                        const url = window.prompt("Enter image URL:");
                        if (url) setFormData((prev) => ({ ...prev, image: url }));
                      }}
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {session.user.name || session.user.username}
                    </p>
                    <p className="text-sm text-slate-500">
                      @{session.user.username}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Display Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Your display name"
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details (read-only)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Email"
                  value={session.user.email}
                  disabled
                  helperText="Email cannot be changed"
                />
                <Input
                  label="Username"
                  value={session.user.username}
                  disabled
                  helperText="Username cannot be changed"
                />
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                Save changes
              </Button>
            </div>
          </form>
        </Container>
      </div>
    </div>
  );
}

