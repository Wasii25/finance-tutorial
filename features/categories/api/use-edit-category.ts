import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]["json"]>;

export const useEditCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            if (!id) {
                throw new Error("Category ID is required");
            }
            
            const response = await client.api.categories[":id"]["$patch"]({
                param: { id },
                json,
            });

            // Add type assertion for the response
            const data = (await response.json()) as ResponseType;
            return data;
        },
        onSuccess: () => {
            // Optionally invalidate or update queries after mutation success
            toast.success("Category updated")
            queryClient.invalidateQueries({ queryKey: ["category", { id }]}); 
            queryClient.invalidateQueries({ queryKey: ["categories"]}); 

        },
        onError: () => {
            toast.error("Failed to edit category")
        }
    });

    return mutation;
};
