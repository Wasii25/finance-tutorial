import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useTransaction = (id?: string) => {
    return useQuery({
        queryKey: ['account', id],
        queryFn: () => client.api.transactions[":id"].$get({ param: { id: id! } }),
        enabled: !!id
    });
}; 