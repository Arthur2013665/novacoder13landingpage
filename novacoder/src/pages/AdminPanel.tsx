import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Shield, ArrowLeft, Users, FileText, Megaphone, Server,
  Activity, Key, ScrollText, Bell
} from "lucide-react";

import AdminUserManagement from "@/components/admin/AdminUserManagement";
import AdminContentModeration from "@/components/admin/AdminContentModeration";
import AdminAnnouncements from "@/components/admin/AdminAnnouncements";
import AdminSiteControl from "@/components/admin/AdminSiteControl";
import AdminRolesPermissions from "@/components/admin/AdminRolesPermissions";
import AdminAuditLog from "@/components/admin/AdminAuditLog";
import AdminAlertRules from "@/components/admin/AdminAlertRules";

const TABS = [
  { id: "users", label: "Users", icon: Users },
  { id: "content", label: "Content", icon: FileText },
  { id: "announcements", label: "Announce", icon: Megaphone },
  { id: "site", label: "Site & AI", icon: Server },
  { id: "roles", label: "Roles", icon: Key },
  { id: "audit", label: "Audit", icon: ScrollText },
  { id: "alerts", label: "Alerts", icon: Bell },
] as const;

type TabId = typeof TABS[number]["id"];

export default function AdminPanel() {
  const { user } = useAuth();
  const { role, loading: roleLoading, isAdmin, isOwner } = useUserRole();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("users");

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/");
    }
  }, [roleLoading, isAdmin, navigate]);

  if (roleLoading || (!isAdmin && !roleLoading)) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case "users": return <AdminUserManagement />;
      case "content": return <AdminContentModeration />;
      case "announcements": return <AdminAnnouncements />;
      case "site": return <AdminSiteControl />;
      case "roles": return <AdminRolesPermissions />;
      case "audit": return <AdminAuditLog />;
      case "alerts": return <AdminAlertRules />;
    }
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="font-semibold text-lg">{isOwner ? "Owner" : "Admin"} Panel</h1>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto pb-0 -mb-px">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {renderTab()}
      </div>
    </div>
  );
}
