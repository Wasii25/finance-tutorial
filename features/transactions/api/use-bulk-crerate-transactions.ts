import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>;

export const useBulkCreateTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-create"]["$post"](json);
            return response.json(); // Simplified
        },
        onSuccess: () => {
            // Optionally invalidate or update queries after mutation success
            toast.success("Transaction created")
            queryClient.invalidateQueries({ queryKey: ["transactions"]}); 
        },
        onError: () => {
            toast.error("Failed to create transaction")
        }
    });

    return mutation;
};
