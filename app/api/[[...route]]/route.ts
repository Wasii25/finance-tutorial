import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";

export const runtime = 'edge';

const app = new Hono().basePath('/api');

app.route("/accounts", accounts);
app.route("/categories", categories);
app.route("/transactions", transactions);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type Apptype = typeof app;