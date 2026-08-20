import type { NextConfig } from "next";

// Détection automatique du repository GitHub pour GitHub Pages
const isProd = process.env.NODE_ENV === "production";
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split("/")[1]
  : process.env.NEXT_PUBLIC_BASE_PATH || "";

// Si c'est un repo utilisateur (ex: user.github.io), pas de sous-dossier, sinon sous-dossier repoName
const isUserPage = repoName.endsWith(".github.io");
const basePath = isProd && repoName && !isUserPage ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  webpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: "@dyad-sh/nextjs-webpack-component-tagger",
      });
    }
    return config;
  },
};

export default nextConfig;