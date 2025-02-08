import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.categories.$post({ json });
            return response.json(); // Simplified
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
