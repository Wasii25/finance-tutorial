import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useAccount = (id?: string) => {
    return useQuery({
        queryKey: ['account', id],
        queryFn: () => client.api.accounts[":id"].$get({ param: { id: id! } }),
        enabled: !!id
    });
}; 