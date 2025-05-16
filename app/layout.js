import {Inter} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { NavbarWrapper } from "@/components/ui/navbar-wrapper";
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import HeaderWrapper from "@/components/HeaderWrapper";
import { Toaster } from "@/components/ui/sonner";
import AuthedFloatingBar from "@/components/AuthedFloatingBar";
import FloatingBar from "@/components/Home/floating-bar";

const inter = Inter({ subsets: ["latin"] });



export const metadata = {
  title: "Rexite",
  description: "AI powered Tutor",
};



export default function RootLayout({ children }) {
  return (
    <ClerkProvider 
      appearance={{
        baseTheme: dark,
      }}
      fallbackRedirectUrl="/onboarding"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      clockSkewInMs={20000}
    >
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
        >
            <NavbarWrapper />
            <HeaderWrapper/>
            <main className="min-h-screen">
              {children}
            </main>
            <Toaster />
            <FloatingBar/>
             {/*<AuthedFloatingBar /> */}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
