import { Inter } from "next/font/google";

import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "仮想通貨の税金計算シミュレーションツール",
  description:
    "簡単な質問に答えるだけで、仮想通貨取引の税金を簡単に概算します。さっそく始めましょう！"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja-JP">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
