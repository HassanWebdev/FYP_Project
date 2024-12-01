import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Transtionprovider from "@/components/Custom/TransitionProvider";
import InitialLoadingScreen from "@/components/Custom/intialscreen";
import SmoothScrolling from "@/components/Custom/SmoothScrolling";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background  font-sans  antialiased",
          fontSans.variable
        )}
      >
          <SmoothScrolling>
          {/* <InitialLoadingScreen /> */}
          <Transtionprovider>
            {children}
            </Transtionprovider>
        </SmoothScrolling> 
      </body>
    </html>
  );
}
