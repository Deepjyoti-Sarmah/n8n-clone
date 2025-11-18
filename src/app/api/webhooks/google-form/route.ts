import { NextRequest, NextResponse } from "next/server";
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

    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondentEmail: body.respondentEmail,
      responses: body.responses,
      raw: body,
    };

    //TODO: remove before deployment
    // console.log("Google Form data: ", formData);

    // Trigger an Inngest job
    await sendWorkflowExecution({
      workflowId: workflowId,
      initialData: {
        googleForm: formData,
      },
    });

    //TODO: remove before deployment
    // console.log("WorkflowExecution: ", workflowEcecution);
  } catch (error) {
    console.error("Google form webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process Google Form submission",
      },
      { status: 500 },
    );
  }
}
