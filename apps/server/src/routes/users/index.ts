import { Hono } from "hono";
import signup from "./signup";
import signin from "./signin";

const users = new Hono();

users.route("/signup", signup);
users.route("/signin", signin);

export default users;
