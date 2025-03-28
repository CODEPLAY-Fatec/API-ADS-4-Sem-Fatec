import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import FadeIn from "@/created-components/FadeIn";
import { Toaster } from 'react-hot-toast';
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "800"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favico.png" type="image/png" />
      </head>
      <body className={poppins.className}>
        <FadeIn>
          {children}
          <Toaster />
        </FadeIn>
      </body>
    </html>
  );
}