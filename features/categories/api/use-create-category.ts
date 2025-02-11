import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import type { AppType } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

// Add type assertion
const typedClient = client as AppType;

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await typedClient.api.categories.$post({ json });
            
            if (!response.ok) {
                throw new Error('Failed to create category');
            }
            
            const data = await response.json();
            return data;
        },
        onSuccess: () => {
            // Optionally invalidate or update queries after mutation success
            queryClient.invalidateQueries({ queryKey: ["categories"]}); 
            toast.success("Category created")
        },
        onError: () => {
            toast.error("Failed to create category")
        }
    });

    return mutation;
};
