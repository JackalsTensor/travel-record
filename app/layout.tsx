import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "行迹 · XINGJI", description: "我的中国旅行数字地图" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
