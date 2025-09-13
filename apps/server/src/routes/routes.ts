import { Hono } from "hono";
import signup from "./users/signup";
import signin from "./users/signin";
import workflows from "./workflows";
import credentials from "./credentials";
import users from "./users";
import authMiddleware from "../middlewares/auth";

const router = new Hono();

router.route("/user", users);
router.route("/credentials", credentials);
router.route("/workflows", workflows);

export default router;
