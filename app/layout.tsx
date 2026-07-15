import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: { default: "Le Français · 我的法语学习空间", template: "%s · Le Français" }, description: "以教材为核心的个人法语学习与复习系统。", icons: { icon: "/favicon.svg" } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-CN"><body>{children}</body></html>; }
