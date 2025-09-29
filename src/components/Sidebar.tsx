import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Shield,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Building2,
  Package,
  Swords,
  Trophy,
  Coins
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { useLogout } from '../hooks/auth.hooks';
import { cn } from '../lib/utils';
import { ThemeToggle } from './theme-toggle';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  adminOrLeaderOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Membros',
    href: '/members',
    icon: Users,
  },
  {
    name: 'Cps',
    href: '/company-parties',
    icon: Building2,
  },
  {
    name: 'Raids',
    href: '/raids',
    icon: Swords,
  },
  {
    name: 'DKP',
    href: '/dkp',
    icon: Trophy,
  },
  {
    name: 'Itens',
    href: '/items',
    icon: Package,
    adminOrLeaderOnly: true,
  },
  {
    name: 'Itens Dropados',
    href: '/dropped-items',
    icon: Coins,
  },
  {
    name: 'Controle Administrativo',
    href: '/admin',
    icon: Shield,
    adminOnly: true,
  },
  {
    name: 'Relatórios & Estatísticas',
    href: '/reports',
    icon: BarChart3,
    adminOnly: true,
  },
  {
    name: 'Perfil',
    href: '/profile',
    icon: User,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const isAdminOrLeader = isAdmin || user?.role === 'CP_LEADER';
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();

    window.location.href = '/login';
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly) {
      return isAdmin;
    }
    if (item.adminOrLeaderOnly) {
      return isAdminOrLeader;
    }
    return true;
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className={cn("flex items-center space-x-2", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">OT</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg">OmegaTeam</h1>
              <p className="text-xs text-muted-foreground">Lineage CP Manager</p>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {!isCollapsed && user && (
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? 'Administrador' : 'Jogador'}
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href !== '/' && location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
                isCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("h-5 w-5", isCollapsed && "h-6 w-6")} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        {/* Theme Toggle */}
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && <span className="text-sm text-muted-foreground">Tema</span>}
          <ThemeToggle />
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3", isCollapsed && "h-6 w-6")} />
          {!isCollapsed && "Sair"}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={cn(
        "hidden lg:flex flex-col bg-card border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}>
        <SidebarContent />
      </aside>

      <aside className={cn(
        "lg:hidden fixed left-0 top-0 z-50 h-full w-64 bg-card border-r transition-transform duration-300",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>
    </>
  );
};
