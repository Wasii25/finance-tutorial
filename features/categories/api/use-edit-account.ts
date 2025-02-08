import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]["json"]>;

export const useEditAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            if (!id) {
                throw new Error("Account ID is required");
            }
            
            const response = await client.api.accounts[":id"]["$patch"]({
                param: { id },
                json,
            });

            // Add type assertion for the response
            const data = (await response.json()) as ResponseType;
            return data;
        },
        onSuccess: () => {
            // Optionally invalidate or update queries after mutation success
            toast.success("Account updated")
            queryClient.invalidateQueries({ queryKey: ["accounts", { id }]}); 
            queryClient.invalidateQueries({ queryKey: ["accounts"]}); 

        },
        onError: () => {
            toast.error("Failed to edit account")
        }
    });

    return mutation;
};
