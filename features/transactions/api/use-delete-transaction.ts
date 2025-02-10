import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["patch"]>;

export const useDeleteTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            if (!id) {
                throw new Error("Transaction ID is required");
            }
            
            const response = await client.api.transactions[":id"]["$delete"]({
                param: { id },
            });

            // Add type assertion for the response
            const data = (await response.json()) as ResponseType;
            return data;
        },
        onSuccess: () => {
            // Optionally invalidate or update queries after mutation success
            toast.success("Transaction deleted")
            queryClient.invalidateQueries({ queryKey: ["transaction", { id }]}); 
            queryClient.invalidateQueries({ queryKey: ["transactions"]}); 

        },
        onError: () => {
            toast.error("Failed to delete transaction")
        }
    });

    return mutation;
};
