import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

const app = new Hono()
    .get(
        "/",
        clerkMiddleware(),
        //Above clerk middleware is to let only the authenticated users access the api
        async (c) => {
            const auth = getAuth(c);

            if(!auth?.userId){
                 throw new HTTPException(401, {
                    res: c.json({ error: "unauthorized"}, 401),
                    // the res above stands for response that is sent to route.ts, in the app.onError, getResponse() in the if block
            });
            }

            const data = await db
            .select({
                id:accounts.id,
                name:accounts.name,
            })
            .from(accounts)
            .where(eq(accounts.userId, auth.userId));

        return c.json({ data });
});

export default app;
