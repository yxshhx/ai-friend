import { NextConfig } from "next";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load `.env` variables

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY, // ✅ Ensure it's accessible
  },
};

export default nextConfig;
