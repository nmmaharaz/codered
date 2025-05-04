import { Poppins } from "next/font/google";
import "./globals.css";
// import Navbar from "./components/Navbar";
import SessionWrapper from "@/Providers/SessionWrapper";
import { Toaster } from "react-hot-toast";
import LayoutWrapper from "@/Providers/LayoutWrapper";
import FloatingButton from "./code-editor/components/FloatingButton";
import ChatProvider from "@/messages/Context/ChatProvider";
import QueryProvider from "@/Providers/QueryProvider";
// import ChatProvider from "@/Demo/antor/messages/Context/ChatProvider";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "CodeRed",
  description: "This is a Forum for devlopers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`} >
        <SessionWrapper>
        <QueryProvider>
          <ChatProvider>
            <Toaster />
            {/* <Navbar /> */}
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <FloatingButton />
          </ChatProvider>
        </QueryProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
