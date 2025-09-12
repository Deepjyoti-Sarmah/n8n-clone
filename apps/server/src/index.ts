import "dotenv/config";
import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import v1Routes from "./routes/routes";
import { config } from "@repo/commons";

const app = new Hono();

app.use(logger());
app.use(cors());

app.get("/", (c: Context) => {
  return c.text("hello hono");
});

app.route("/api/v1", v1Routes);
// app.route("/", webhooks);

const port = config.server.port;
console.log(port);
console.log(config.dbURL.postgres.url);
console.log(config.server.jwtSecret);
export default {
  fetch: app.fetch,
  port: port,
};
