import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { Topbar } from "./components/Topbar";
import { Sidebar } from "./components/Sidebar";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/app/components/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable, 
          robotoMono.variable, 
          "antialiased bg-background min-h-screen"
        )}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <UserProvider>
            <AuthProvider>
              <SidebarProvider>
                <div className="relative flex min-h-screen flex-col">
                  <Topbar />
                  <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto p-6 pt-4">
                      <div className="container mx-auto max-w-7xl">
                        {children}
                      </div>
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </AuthProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
