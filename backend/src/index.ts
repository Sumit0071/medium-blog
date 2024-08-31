import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from "hono/cors";
const app = new Hono<{
  Bindings: {
    JWT_SECRET: string
    DATABASE_URL: string;
  }
}>()
app.use( '/*', cors() );
app.get( '/', ( c ) => {
  return c.text( "hello hono" );
} );
app.route( "/api/v1/user", userRouter );
app.route( "/api/v1/blog", blogRouter );



export default app
