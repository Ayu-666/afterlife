import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "www.akashi-kama.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "cdn.exoticindia.com",
      },
      {
        protocol: "https",
        hostname: "img.foter.com",
      },
      {
        protocol: "https",
        hostname: "live.staticflickr.com",
 
      },
      {
        protocol: "https",
        hostname: "sowpeace.in",
      },
      {
        protocol: "https",
        hostname: "www.wileyplus.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "books.google.com",
      },

    ],
  },
};

export default nextConfig;