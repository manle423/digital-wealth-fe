import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth.context";
import { LayoutProvider } from "@/contexts/layout.context";
import ConditionalHeader from "@/components/layout/conditional-header";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["vietnamese"] });

export const metadata = {
  title: "Digital Wealth",
  description: "Digital Wealth",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="preconnect" href="https://images.unsplash.com" />
          <link rel="dns-prefetch" href="https://images.unsplash.com" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body className={inter.className} suppressHydrationWarning>
          <ErrorBoundary>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider>
                <LayoutProvider>
                  <ConditionalHeader />
                  {children}
                  <Toaster />
                </LayoutProvider>
              </AuthProvider>
            </ThemeProvider>
          </ErrorBoundary>
        </body>
      </html>
    </>
  );
}
