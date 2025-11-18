import { realtimeMiddleware } from "@inngest/realtime/middleware";
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "n8n-clone",
  middleware: [realtimeMiddleware()],
});
