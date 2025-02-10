import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]["json"]>;

export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            if (!id) {
                throw new Error("Transaction ID is required");
            }
            
            const response = await client.api.transactions[":id"]["$patch"]({
                param: { id },
                json,
            });

            // Add type assertion for the response
            const data = (await response.json()) as ResponseType;
            return data;
        },
        onSuccess: () => {
            // Optionally invalidate or update queries after mutation success
            toast.success("Transaction updated")
            queryClient.invalidateQueries({ queryKey: ["transaction", { id }]}); 
            queryClient.invalidateQueries({ queryKey: ["transactions"]}); 

        },
        onError: () => {
            toast.error("Failed to edit transaction")
        }
    });

    return mutation;
};
