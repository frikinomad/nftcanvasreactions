import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFT Canvas",
  description: "Mint NFT with your like milestone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="dscvr:canvas:version" content="vNext"/>
        {/* <meta name="og:image" content="https://dscvr-buildathon.vercel.app/Cptn_BlockBeard_w2.jpg"></meta> */}
        <meta name="og:image" content="https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png"></meta>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
