import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/context/cart-store";
import { useAuthStore } from "@/context/auth-store";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, isAuthenticated, logout } = useAuthStore();

  const navLinks = [
    { href: "/", label: "เมนูอาหาร" },
    { href: "/orders", label: "ประวัติการสั่ง" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-white/80 backdrop-blur-lg dark:bg-[var(--background)]/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-[var(--foreground)]">
            ร้านอาหาร
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[var(--primary)]",
                isActive(link.href)
                  ? "text-[var(--primary)]"
                  : "text-[var(--muted-foreground)]"
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className={cn(
                "text-sm font-medium transition-colors hover:text-[var(--primary)]",
                isActive("/admin")
                  ? "text-[var(--primary)]"
                  : "text-[var(--muted-foreground)]"
              )}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center p-0 text-[10px]">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Auth Button */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-[var(--muted-foreground)]">
                {user?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                ออกจากระบบ
              </Button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-[var(--border)] bg-white p-4 md:hidden dark:bg-[var(--background)]">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-[var(--primary)] text-white"
                    : "hover:bg-[var(--accent)]"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && user?.role === "ADMIN" && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive("/admin")
                    ? "bg-[var(--primary)] text-white"
                    : "hover:bg-[var(--accent)]"
                )}
              >
                Admin
              </Link>
            )}
            <hr className="my-2 border-[var(--border)]" />
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm text-[var(--muted-foreground)]">
                  {user?.name}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="rounded-lg px-4 py-2 text-left text-sm font-medium text-[var(--destructive)] hover:bg-[var(--accent)]"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-[var(--accent)]"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
