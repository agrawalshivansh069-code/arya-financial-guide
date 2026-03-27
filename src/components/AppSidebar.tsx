import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Flame, HeartPulse, Calculator,
  Milestone, TrendingUp, Sparkles
} from "lucide-react";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/fire", icon: Flame, label: "FIRE Planner" },
  { to: "/health", icon: HeartPulse, label: "Money Health" },
  { to: "/tax", icon: Calculator, label: "Tax AI" },
  { to: "/life-events", icon: Milestone, label: "Life Events" },
  { to: "/goals", icon: TrendingUp, label: "Goal Tracker" },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display font-bold text-foreground text-lg leading-tight">AI Money</h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Mentor</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink key={to} to={to} className="block relative">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-sidebar-accent"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:text-sidebar-accent-foreground"}`}>
                <Icon className="w-4 h-4" />
                {label}
              </div>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 mx-3 mb-4 glass-card rounded-xl">
        <p className="text-xs text-muted-foreground mb-1">Built for 🇮🇳 India</p>
        <p className="text-[10px] text-muted-foreground">SIP • ELSS • PPF • NPS • EPF</p>
      </div>
    </aside>
  );
}
