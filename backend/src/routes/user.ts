import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { signUpInput, signInInput } from "@sumit_adhikari/medium-common"
export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>();

userRouter.post( '/signup', async ( c ) => {

  const body = await c.req.json();
  const { success } = signUpInput.safeParse( body );
  if ( !success ) {
    c.status( 411 );
    return c.json( {
      msg: "Incorrect credentials"
    } )
  }

  const prisma = new PrismaClient( {
    datasourceUrl: c.env.DATABASE_URL,
  } ).$extends( withAccelerate() )
  try {
    const user = await prisma.user.create( {
      data: {
        username: body.username,
        password: body.password,
        name: body.name
      }
    } )

    const jwt = await sign( {
      id: user.id
    }, c.env.JWT_SECRET );
    return c.text( jwt )
  }
  catch ( e ) {

    c.status( 411 );
    return c.json( {
      msg: "Incorrect credentials"
    } )
  }


} );

userRouter.post( '/signin', async ( c ) => {

  const body = await c.req.json();
  const { success } = signInInput.safeParse( body );
  if ( !success ) {
    c.status( 411 );
    return c.json( {
      msg: "Incorrect credentials"
    } )
  }
  const prisma = new PrismaClient( {
    datasourceUrl: c.env.DATABASE_URL,
  } ).$extends( withAccelerate() )
  try {
    const user = await prisma.user.findFirst( {
      where: {
        username: body.username,
        password: body.password,
        name: body.name
      }
    } )
    if ( !user ) {
      c.status( 403 );
      return c.text( 'Unauthorized User' )
    }
    const jwt = await sign( {
      id: user.id
    }, c.env.JWT_SECRET );
    return c.text( jwt )
  }
  catch ( e ) {

    c.status( 411 );
    return c.text( 'Invalid' )
  }


} );