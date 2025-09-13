import { Hono } from "hono";
import createWorkflow from "./createWorkflow";
import getWorkflows from "./getWorkflows";
import updateWorkflow from "./updateWorkflow";
import deleteWorkflow from "./deleteWorkflow";

const workflows = new Hono();

workflows.route("/post", createWorkflow);
workflows.route("/get", getWorkflows);
workflows.route("/update", updateWorkflow);
workflows.route("/delete", deleteWorkflow);

export default workflows;
