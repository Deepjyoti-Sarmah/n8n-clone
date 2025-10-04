import { credentialsAPI } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCredentials() {
  return useQuery({
    queryKey: ["credentials"],
    queryFn: async () => {
      const response = await credentialsAPI.getAll();
      return response;
    },
    staleTime: 30000,
  });
}

export function useCredential(id: string | undefined) {
  return useQuery({
    queryKey: ["credentials", id],
    queryFn: async () => {
      if (!id) throw new Error("Credential ID is required");
      const response = await credentialsAPI.getById(id);
      return response.credential;
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCreateCredentials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credenital: any) => {
      const response = await credentialsAPI.create(credenital);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
    onError: (error: any) => {
      console.error("Failed to create credential:", error);
    },
  });
}

export function useUpdateCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id: data }: { id: string; data: any }) => {
      const response = await credentialsAPI.update(id, data);
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
      queryClient.invalidateQueries({ queryKey: ["credentials", id] });
    },
    onError: (error: any) => {
      console.error("Failed to update credential:", error);
    },
  });
}

export function useDeleteCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await credentialsAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
    onError: (error: any) => {
      console.error("Failed to delete credential:", error);
    },
  });
}
