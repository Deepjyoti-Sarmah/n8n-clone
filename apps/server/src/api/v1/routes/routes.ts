import { Hono } from "hono";
import signup from "./users/signup";
import signin from "./users/signin";

const v1Routes = new Hono();

v1Routes.route("/user/signup", signup);
v1Routes.route("/user/signin", signin);

export default v1Routes;
