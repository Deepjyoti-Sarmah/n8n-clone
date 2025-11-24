import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  //TODO: remove before deploymment
  console.log("session: ", session);

  if (!session) {
    redirect("/login");
  }

  return session;
};

export const requireUnauth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  //TODO: remove before deploymment
  console.log("session unauth: ", session);

  if (session) {
    redirect("/");
  }

  return session;
};
