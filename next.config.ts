
import type { NextConfig } from "next";

// GitHub Actions sets this automatically during deployment.
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  // Generate a static website in the "out" folder.
  output: "export",

  // GitHub Pages hosts project websites under /repository-name.
  // Keep local development at http://localhost:3000.
  ...(isGitHubActions
    ? { basePath: "/my-counter" }
    : {}),

  // Generate folders with index.html for GitHub Pages.
  trailingSlash: true,

  // Preserve your existing Tailwind/Turbopack configuration.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Preserve your local development origins.
  allowedDevOrigins: [
    "10.141.26.97",
    "192.168.31.234",
  ],
};

export default nextConfig;
