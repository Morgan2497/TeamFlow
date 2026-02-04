"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) { // Removed extra )
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>; // Fixed typo "NextThemese"
}
