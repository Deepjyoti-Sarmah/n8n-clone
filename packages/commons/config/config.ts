import dotenv from "dotenv";
dotenv.config();

export const config = {
  dbURL: {
    postgres: {
      url:
        process.env.DATABASE_URL ||
        "postgresql://postgres:mysecretpassword@localhost:5432/n8n",
    },
  },
  server: {
    port: process.env.PORT || 3002,
    jwtSecret: process.env.JWT_SECRET || "secret123",
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
  talvi: {
    api_key: process.env.TAVILY_API_KEY || "api_key...",
  },
};
