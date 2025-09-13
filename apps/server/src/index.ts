import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { config } from "@repo/commons";
import router from "./routes/routes";
import webhooks from "./routes/webhooks";

const app = new Hono();

app.use(logger());
app.use(cors());

app.get("/", (c: Context) => {
  return c.text("hello hono");
});

app.route("/api/v1", router);
app.route("/webhooks", webhooks);

export default {
  fetch: app.fetch,
  port: config.server.port,
};
