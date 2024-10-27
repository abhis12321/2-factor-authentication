import "./globals.css";
import localFont from "next/font/local";
import AuthProvider from "./__components/AuthProvider";
import { getJWTUserInfo } from "@/getJWTUserInfo";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "2-factor-authentication",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const initialUserInfo = getJWTUserInfo();
  return (
    <html lang="en">
      <AuthProvider initialUserInfo={initialUserInfo}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`} >
          { children }
        </body>
      </AuthProvider>
    </html>
  );
}
