"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Key,
  TerminalSquare,
  Activity,
  Cpu,
  CreditCard,
  Lock,
  LogOut,
  Sparkles,
  ArrowLeftRight,
  LayoutDashboard,
  Book,
} from "lucide-react";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  developerName?: string;
  developerEmail?: string;
  activePlan?: string;
  onLogout?: () => void;
}

export function AppSidebar({
  developerName = "Developer",
  developerEmail = "developer@neuralpress.io",
  activePlan = "free",
  onLogout,
  ...props
}: AppSidebarProps) {
  const pathname = usePathname();

  // Deduce active tab ID from current pathname path
  const activeTab = pathname.includes("playground")
    ? "playground"
    : pathname.includes("news")
      ? "feed"
      : pathname.includes("webhooks")
        ? "webhooks"
        : pathname.includes("ingestion")
          ? "ingestion"
          : pathname.includes("billing")
            ? "billing"
            : pathname.includes("keys")
              ? "keys"
              : "overview";

  const menuItems = [
    {
      id: "overview" as const,
      title: "Overview & Analytics",
      icon: <LayoutDashboard className="size-4 text-indigo-650" />,
      locked: false,
      href: "/developer",
    },
    {
      id: "keys" as const,
      title: "Secure API Keys",
      icon: <Key className="size-4 text-violet-650" />,
      locked: false,
      href: "/developer/keys",
    },
    {
      id: "playground" as const,
      title: "API Playground",
      icon: <TerminalSquare className="size-4 text-emerald-600" />,
      locked: false,
      badge: "LIVE",
      href: "/developer/playground",
    },
    {
      id: "feed" as const,
      title: "News Feed",
      icon: <Book className="size-4 text-black" />,
      locked: false,
      // badge: "LIVE",
      href: "/developer/news",
    },
    // {
    //   id: "webhooks" as const,
    //   title: "Webhooks Receiver",
    //   icon: <Activity className="size-4 text-pink-600" />,
    //   locked: activePlan === "free",
    //   badge: "Soon",
    //   href: "/developer",
    // },
    // {
    //   id: "ingestion" as const,
    //   title: "Topic & Sentiment Filters",
    //   icon: <Cpu className="size-4 text-cyan-600" />,
    //   locked: activePlan !== "advanced",
    //   href: "/developer/ingestion",
    // },
    // {
    //   id: "billing" as const,
    //   title: "Billing & Sandbox Plan",
    //   icon: <CreditCard className="size-4 text-amber-600" />,
    //   locked: false,
    //   href: "/developer/billing",
    // },
  ];

  return (
    <Sidebar
      variant="inset"
      className="border-r border-slate-200 bg-white"
      {...props}
    >
      <SidebarHeader className="border-b border-slate-100 p-4 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/"
                className="hover:opacity-80 transition flex items-center gap-3"
              >
                <img
                  src="/main-logo.png"
                  width={80}
                  height={80}
                  className="w-9 lg:w-[35px] transition-transform duration-700"
                  alt="NeuralPress"
                />
                <div className="grid flex-1 text-left text-sm leading-tight text-slate-800">
                  <span className="truncate tracking-tight">NeuralPress</span>
                  <span className="truncate text-[10px] text-slate-400 font-medium">
                    Developer Hub
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-0 bg-slate-50/50 rounded-2xl">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 text-[10px] uppercase tracking-wider px-3 mb-2">
            Platform Console
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <SidebarMenuItem key={item.id}>
                  <Link href={item.href} className="w-full">
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] transition cursor-pointer ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className="bg-emerald-100 text-emerald-700 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                        {item.locked && (
                          <Lock className="size-3 text-slate-400" />
                        )}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 p-3 space-y-2 bg-white">
        {/* User Card */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 uppercase">
              ACTIVE LICENSE
            </span>
            <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase">
              {activePlan}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800 truncate mt-1">
            {developerName}
          </p>
          <p className="text-[10px] text-slate-400 truncate">
            {developerEmail}
          </p>
        </div>

        {/* Back to site and logout */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 transition"
          >
            <ArrowLeftRight className="size-3" /> Back
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl text-[10px] font-bold text-rose-600 transition cursor-pointer"
          >
            <LogOut className="size-3" /> Exit
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
