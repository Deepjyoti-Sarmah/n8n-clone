import { Hono } from "hono";
import signup from "./auth/signup";
import signin from "./auth/signin";
import workflow from "./workflows/workflow";
import credentials from "./credentials/credentials";
import webhook from "./webhooks/webhook";

const v1Router = new Hono();

v1Router.route("/signup", signup);
v1Router.route("/signin", signin);

v1Router.route("/workflow", workflow);

v1Router.route("/credential", credentials);

v1Router.route("/wobhook", webhook);

export default v1Router;
