import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray} from "drizzle-orm";
import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator"
import { createId } from "@paralleldrive/cuid2"
import { z } from "zod";


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
    .get(
        "/:id",
        zValidator("param", z.object({
            id: z.string().optional()
        })),
        clerkMiddleware(),

        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if(!id){
                return c.json({ error: "Missing ID"}, 400);
            }

            if(!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const [data] = await db
            .select({
                id: accounts.id,
                name: accounts.name,
            })
            .from(accounts)
            .where(
                and(
                    eq(accounts.userId, auth.userId),
                    eq(accounts.id, id)
                ),
            );

            if(!data) {
                return c.json({ error: "Not Found" }, 404);
            }

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
    .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator(
            "json",
            z.object({
                ids: z.array(z.string()),
            }),
        ),

        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");

            if(!auth?.userId){
                return c.json({ error: "Unauthorized"}, 401);
            }

            const data = await db
                .delete(accounts)
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        inArray(accounts.id, values.ids)
                    )
                )
                .returning({
                    id: accounts.id,
                });

            return c.json({ data });
        }
    )
    
    .patch(
        "/:id",
        clerkMiddleware(),
        zValidator(
            "param",
            z.object({
                id: z.string().optional(),
            }),
        ),
        zValidator(
            "json",
            insertAccountSchema.pick({
                name: true,
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");
            const values = c.req.valid("json");

            if(!id) {
                return c.json({ error : " Missing ID" }, 400);
            };

            if(!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401);
            };

            const [data] = await db 
            .update(accounts)
            .set(values)
            .where(
                and(
                    eq(accounts.userId, auth.userId),
                    eq(accounts.id, id),
                ),
            )
            .returning();

            if(!data) {
                return c.json({ error: "account not found" });
            };

            return c.json({ data });

        },
    )

    .delete(
        "/:id",
        clerkMiddleware(),
        zValidator(
            "param",
            z.object({
                id: z.string().optional(),
            }),
        ),
        
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if(!id) {
                return c.json({ error : " Missing ID" }, 400);
            };

            if(!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401);
            };

            const [data] = await db 
            .delete(accounts)
            .where(
                and(
                    eq(accounts.userId, auth.userId),
                    eq(accounts.id, id),
                ),
            )
            .returning({
                id: accounts.id
            });

            if(!data) {
                return c.json({ error: "account not found" });
            };

            return c.json({ data });

        },
    )
    
export default app;
