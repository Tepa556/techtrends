import type { NextConfig } from "next";

const nextConfig: NextConfig = {
env: {
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
}
};

export default nextConfig;
