import type { Metadata } from "next";
import "@rainbow-me/rainbowkit/styles.css";
import "@fontsource-variable/nunito-sans";
import "./globals.css";
import "./quality.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Labelwise | GenLayer",
  description: "Stop allergen claims from drifting away from formulas and supplier declarations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Providers>{children}</Providers></body></html>;
}
