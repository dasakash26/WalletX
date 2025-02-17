import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Outlet } from "react-router";

export function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
