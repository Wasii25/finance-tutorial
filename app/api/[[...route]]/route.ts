import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app
  .get('/hello', (c) => {
    return c.json({
      message: 'Hello Next.js!',
    })
  })
  .get("/hello/:test", (c) => {
    const test = c.req.param("test");
    return c.json({
      message: "Hello world"
    })
  })

export const GET = handle(app)
export const POST = handle(app)