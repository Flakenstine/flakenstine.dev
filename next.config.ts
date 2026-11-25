import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A self-contained server in .next/standalone, for the Docker image.
  output: "standalone",
  poweredByHeader: false,
  // Posts from the previous site, which people and search engines link to.
  redirects() {
    return [
      {
        source: "/blog/hello-world",
        destination: "/blog/hello-world-again",
        permanent: true,
      },
      {
        // Temporary, in case this post comes back.
        source: "/blog/my-journey-bazzite",
        destination: "/blog",
        permanent: false,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
