import { workflowsAPI } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      const response = await workflowsAPI.getAll();
      return response.useWorkflows || [];
    },
    staleTime: 30000,
  });
}

export function useWorkflow(id: string | undefined) {
  return useQuery({
    queryKey: ["workflows", id],
    queryFn: async () => {
      if (!id) throw new Error("Workflow ID is required");
      const response = await workflowsAPI.getById(id);
      return response.Workflow;
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflow: any) => {
      const response = await workflowsAPI.create(workflow);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
    onError: (error: any) => {
      console.error("Failed to create workflow:", error);
    },
  });
}

export function useUpdateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await workflowsAPI.update(id, data);
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["workflows", id] });
    },
    onError: (error: any) => {
      console.error("Failed to update workflow:", error);
    },
  });
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await workflowsAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workflows"],
      });
    },
    onError: (error: any) => {
      console.error("Failed to delete Workflow: ", error);
    },
  });
}

export function useTriggerWorkflow() {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload?: any }) => {
      const response = await workflowsAPI.triggerManual(id, payload);
      return response;
    },

    onSuccess: (data) => {
      console.log("Workflow triggered:", data);
    },
    onError: (error: any) => {
      console.error("Failed to trigger Workflow:", error);
    },
  });
}
