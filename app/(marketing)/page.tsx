// app/page.tsx
import {HeroHeader} from "@/app/(marketing)/_components/header";
import HeroSection from "@/app/(marketing)/_components/hero-section";
import { ThemeToggle } from "@/components/ui/theme-toggle"; // Pointing to components/ui/

export default function Home() {
  return (
    <div>
      <HeroHeader />

      <HeroSection />
    </div>
  );
}
