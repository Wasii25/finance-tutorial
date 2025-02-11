import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["patch"]>;

export const useDeleteCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            if (!id) {
                throw new Error("Category ID is required");
            }
            
            const response = await client.api.categories[":id"]["$delete"]({
                param: { id },
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }

            const data = await response.json();
            return data;
        },
        onSuccess: () => {
            // Optionally invalidate or update queries after mutation success
            toast.success("Category deleted")
            queryClient.invalidateQueries({ queryKey: ["category", { id }]}); 
            queryClient.invalidateQueries({ queryKey: ["categories"]}); 

        },
        onError: () => {
            toast.error("Failed to delete category")
        }
    });

    return mutation;
};
