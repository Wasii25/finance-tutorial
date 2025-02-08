import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>;

export const useBulkDeleteCategories = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.categories["bulk-delete"]["$post"](json);
            return response.json(); // Simplified
        },
        onSuccess: () => {
            // Optionally invalidate or update queries after mutation success
            toast.success("Categories deleted")
            queryClient.invalidateQueries({ queryKey: ["categories"]}); 
        },
        onError: () => {
            toast.error("Failed to delete category")
        }
    });

    return mutation;
};
