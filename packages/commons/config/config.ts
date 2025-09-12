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
};
