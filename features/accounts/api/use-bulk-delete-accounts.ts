import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>;

export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"](json);
            return response.json(); // Simplified
        },
        onSuccess: () => {
            // Optionally invalidate or update queries after mutation success
            toast.success("Account deleted")
            queryClient.invalidateQueries({ queryKey: ["accounts"]}); 
        },
        onError: () => {
            toast.error("Failed to delete account")
        }
    });

    return mutation;
};
