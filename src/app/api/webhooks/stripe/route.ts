import { type NextRequest, NextResponse } from "next/server";
import { sendWorkflowExecution } from "@/inngest/utils";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    //TODO: remove before deployment
    // console.log("URL: ", url);
    // console.log("workflowId: ", workflowId);

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: ",
          workflowId,
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    //TODO: remove before deployment
    // console.log("Google trigger body: ", body);

    const stripeData = {
      // Event metadata
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode: body.livemode,
      raw: body.data?.object,
    };

    //TODO: remove before deployment
    // console.log("Google Form data: ", formData);

    // Trigger an Inngest job
    await sendWorkflowExecution({
      workflowId: workflowId,
      initialData: {
        stripe: stripeData,
      },
    });

    //TODO: remove before deployment
    // console.log("WorkflowExecution: ", workflowEcecution);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process Stripe event",
      },
      { status: 500 },
    );
  }
}
