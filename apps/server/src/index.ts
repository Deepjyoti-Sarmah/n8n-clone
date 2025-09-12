import "dotenv/config";
import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import v1Routes from "./api/v1/routes/routes";

const app = new Hono();

app.use(logger());
app.use(cors());

app.get("/", (c: Context) => {
  return c.text("hello hono");
});

app.route("/api/v1", v1Routes);
// app.route("/", webhooks);

export default app;
