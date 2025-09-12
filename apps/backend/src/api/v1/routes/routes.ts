import { Hono } from "hono";
import signup from "./auth/signup";
import signin from "./auth/signin";
import workflow from "./workflows/workflow";
import credentials from "./credentials/credentials";

const v1Router = new Hono();

v1Router.route("/user/signup", signup);
v1Router.route("/user/signin", signin);

v1Router.route("/workflow", workflow);

v1Router.route("/credential", credentials);

export default v1Router;
