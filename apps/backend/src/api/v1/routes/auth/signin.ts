import { Hono } from "hono";

const signin = new Hono();

signin.post("/");

export default signin;
