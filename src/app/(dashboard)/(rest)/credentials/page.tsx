import { SearchParams } from "nuqs";
import { requireAuth } from "@/lib/auth-utils";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  return <p>Credentials</p>;
};

export default Page;
