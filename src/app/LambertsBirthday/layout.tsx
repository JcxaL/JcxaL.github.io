import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mc",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mc-body",
});

export const metadata: Metadata = {
  title: "Happy Birthday Lambert!",
  description:
    "A legendary Minecraft-themed birthday celebration crafted just for Lambert.",
};

export default function LambertsBirthdayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${pressStart.variable} ${vt323.variable}`}>{children}</div>
  );
}
