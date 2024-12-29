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
        // zValidator is for validating, zValidator(what are we validating, schema for validation, )
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");


            if(!auth?.userId) {
                return c.json({ error: "Unauthorised"}, 401);
            }

            const [data] = await db.insert(accounts).values({
                // adding [] to const data to make it into const [data] actually destructures data
                id: createId(),
                userId: auth.userId,
                ...values, 
            }).returning({});

            return c.json({ data });
        }
    )

export default app;
