// app/page.tsx
import { ThemeToggle } from "@/components/ui/theme-toggle"; // Pointing to components/ui/

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Team Flow</h1>
      <ThemeToggle />
    </main>
  );
}
