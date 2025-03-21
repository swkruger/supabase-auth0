import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AuthProvider } from "./contexts/AuthContext";
import { Topbar } from "./components/Topbar";
import { Sidebar } from "./components/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FiFolio - Todo App",
  description: "The best Todo app ever developed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <UserProvider>
          <AuthProvider>
            <div className="flex flex-col h-screen">
              <Topbar />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-4">
                  {children}
                </main>
              </div>
            </div>
          </AuthProvider>
        </UserProvider>
      </body>
    </html>
  );
}
