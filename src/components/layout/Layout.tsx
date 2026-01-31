import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--border)] bg-white py-6 dark:bg-[var(--muted)]">
        <div className="container mx-auto px-4 text-center text-sm text-[var(--muted-foreground)]">
          <p>© 2024 ร้านอาหาร - ระบบสั่งอาหารออนไลน์</p>
        </div>
      </footer>
    </div>
  );
}
