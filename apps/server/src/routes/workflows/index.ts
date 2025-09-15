import { Hono } from "hono";
import createWorkflow from "./createWorkflow";
import getWorkflows from "./getWorkflows";
import updateWorkflow from "./updateWorkflow";
import deleteWorkflow from "./deleteWorkflow";
import { authMiddleware } from "../../middlewares/auth";
import createManualWorkflow from "./createManualWorkflow";

const workflows = new Hono();

workflows.use("*", authMiddleware);
workflows.route("/post", createWorkflow);
workflows.route("/manual", createManualWorkflow);
workflows.route("/get", getWorkflows);
workflows.route("/update", updateWorkflow);
workflows.route("/delete", deleteWorkflow);

export default workflows;
