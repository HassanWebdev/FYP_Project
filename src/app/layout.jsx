import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Transtionprovider from "@/components/Custom/TransitionProvider";
import InitialLoadingScreen from "@/components/Custom/intialscreen";
import SmoothScrolling from "@/components/Custom/SmoothScrolling";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import CustomMouse from "@/components/Custom/CustomMouse";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "MockMaster AI - Your Interview Preparation Partner",
  description:
    "Practice interviews with AI-powered mock interviews. Get real-time feedback and improve your interview skills.",
  icons: {
    icon: "/AI.png",
  },
};

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
          <InitialLoadingScreen />
          <Transtionprovider>
            <AntdRegistry>
              <CustomMouse>{children}</CustomMouse>
            </AntdRegistry>
          </Transtionprovider>
        </SmoothScrolling>
      </body>
    </html>
  );
}
