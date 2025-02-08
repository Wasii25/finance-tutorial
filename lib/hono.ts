import { hc } from "hono/client";
import type { InferResponseType, InferRequestType } from 'hono/client'
import type { Apptype } from "@/app/api/[[...route]]/route";

export const client = hc<Apptype>(process.env.NEXT_PUBLIC_APP_URL!);

// You can also explicitly type the response and request types if needed:
export type AppResponse = InferResponseType<Apptype>
export type AppRequest = InferRequestType<Apptype>