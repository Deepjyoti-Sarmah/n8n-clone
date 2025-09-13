import { Hono } from "hono";
import addCredentials from "./addCredentials";
import getCredentials from "./getCredentials";
import updateCredentials from "./updateCredentials";
import deleteCredentials from "./deleteCredentials";
import { authMiddleware } from "../../middlewares/auth";

const credentials = new Hono();

credentials.use("*", authMiddleware);
credentials.route("/post", addCredentials);
credentials.route("/get", getCredentials);
credentials.route("/update", updateCredentials);
credentials.route("/delete", deleteCredentials);

export default credentials;
