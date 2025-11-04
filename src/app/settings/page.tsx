"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: true,
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your preferences and account settings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-slate-800 bg-slate-900/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-200">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="text-sm text-slate-400">
                  Receive email updates about your account
                </span>
              </Label>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleSettingChange("emailNotifications")}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                <span>Push Notifications</span>
                <span className="text-sm text-slate-400">
                  Receive push notifications about important updates
                </span>
              </Label>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={() => handleSettingChange("pushNotifications")}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-800 bg-slate-900/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-200">
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                <span className="text-sm text-slate-400">
                  Toggle dark mode theme
                </span>
              </Label>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={() => handleSettingChange("darkMode")}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}