import { DataSource, SimpleConsoleLogger } from "typeorm";
import { User } from "./entities/users";

export const db = new DataSource({
  type: "postgres",
  url:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgrespassword@localhost:5432/n8n",
  logger: new SimpleConsoleLogger(false),
  synchronize: false,
  entities: [User],
  migrations: ["migrations/*.ts"],
});
