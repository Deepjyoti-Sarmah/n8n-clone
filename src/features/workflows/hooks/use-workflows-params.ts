import { useQueryStates } from "nuqs";
import { workflowParams } from "../params";

export const useWorflowsParams = () => {
  return useQueryStates(workflowParams);
};
