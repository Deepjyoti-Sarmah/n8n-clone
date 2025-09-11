import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import v1Router from "./api/v1/routes/routes";

const app = new Hono();

app.use(logger());
app.use(cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/v1", v1Router);

export default app;
