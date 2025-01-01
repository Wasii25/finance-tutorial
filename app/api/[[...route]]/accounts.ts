import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator"
import { createId } from "@paralleldrive/cuid2"

const app = new Hono()
    .get(
        "/",
        clerkMiddleware(),
        //Above clerk middleware is to let only the authenticated users access the api
        async (c) => {
            const auth = getAuth(c);

            if(!auth?.userId){
                 return c.json({ error: "Unauthorised"}, 401)
            }
            

            const data = await db
            .select({
                id:accounts.id,
                name:accounts.name,
            })
            .from(accounts)
            .where(eq(accounts.userId, auth.userId));

        return c.json({ data });
        }
    )
    .post(
        "/",
        clerkMiddleware(),
        zValidator("json", insertAccountSchema.omit({
            plaidId: true,
            id: true,
            userId: true,
        })),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");
    
            if (!auth?.userId) {
                return c.json({ error: "Unauthorised" }, 401);
            }
    
            const [data] = await db.insert(accounts).values({
                // Adding required fields to the database
                id: createId(),
                userId: auth.userId,
                ...values, // Spread the validated JSON values into the insert object
            }).returning({
                id: accounts.id,
                name: accounts.name,
            });
    
            return c.json({ data });
        }
    )
    
export default app;
