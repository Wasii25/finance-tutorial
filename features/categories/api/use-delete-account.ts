import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["patch"]>;

export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            if (!id) {
                throw new Error("Account ID is required");
            }
            
            const response = await client.api.accounts[":id"]["$delete"]({
                param: { id },
            });

            // Add type assertion for the response
            const data = (await response.json()) as ResponseType;
            return data;
        },
        onSuccess: () => {
            // Optionally invalidate or update queries after mutation success
            toast.success("Account deleted")
            queryClient.invalidateQueries({ queryKey: ["accounts", { id }]}); 
            queryClient.invalidateQueries({ queryKey: ["accounts"]}); 

        },
        onError: () => {
            toast.error("Failed to delete account")
        }
    });

    return mutation;
};
