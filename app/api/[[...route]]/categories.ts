import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray} from "drizzle-orm";
import { db } from "@/db/drizzle";
import { categories, insertCategorySchema } from "@/db/schema";
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
                 return c.json({ error: "Unauthorized"}, 401)
            }
            

            const data = await db
            .select({
                id:categories.id,
                name:categories.name,
            })
            .from(categories)
            .where(eq(categories.userId, auth.userId));

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
                id: categories.id,
                name: categories.name,
            })
            .from(categories)
            .where(
                and(
                    eq(categories.userId, auth.userId),
                    eq(categories.id, id)
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
        zValidator("json", insertCategorySchema.omit({
            plaidId: true,
            id: true,
            userId: true,
        })),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");
    
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }
    
            const [data] = await db.insert(categories).values({
                // Adding required fields to the database
                id: createId(),
                userId: auth.userId,
                ...values, // Spread the validated JSON values into the insert object
            }).returning({
                id: categories.id,
                name: categories.name,
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
                .delete(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        inArray(categories.id, values.ids)
                    )
                )
                .returning({
                    id: categories.id,
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
            insertCategorySchema.pick({
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
            .update(categories)
            .set(values)
            .where(
                and(
                    eq(categories.userId, auth.userId),
                    eq(categories.id, id),
                ),
            )
            .returning();

            if(!data) {
                return c.json({ error: "category not found" });
            };

            return c.json({ data });

        },
    )

    .delete(
        //Delete by id
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
            .delete(categories)
            .where(
                and(
                    eq(categories.userId, auth.userId),
                    eq(categories.id, id),
                ),
            )
            .returning({
                id: categories.id
            });

            if(!data) {
                return c.json({ error: "category not found" });
            };

            return c.json({ data });

        },
    )
    
export default app;
