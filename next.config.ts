import type { NextConfig } from "next";

// 纯客户端站点（localStorage + 静态 GeoJSON），静态导出以部署到 Cloudflare Pages。
const nextConfig: NextConfig = { output: "export" };
export default nextConfig;
