
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import prisma from '@/lib/prisma';
import bcryptjs from 'bcryptjs';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/new-account",
  },
  callbacks: {

    authorized({ auth, request: { nextUrl } }) {
      // console.log({ auth, nextUrl });
      
      // const isLoggedIn = !!auth?.user;
      // const isOnDashboard = nextUrl.pathname.startsWith('/');
      // if (isOnDashboard) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/', nextUrl));
      // }
      return true;
    },

    jwt({ token, user }) {

      if ( user ) {
        token.data = user
      }
      
      return token
    },

    session({ session, token, user }) {
      // console.log({ session, token, user })

      session.user = token.data as any
      return session
    },

  },
  
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6)})
          .safeParse(credentials)

          if (!parsedCredentials.success) return null

          const { email, password } = parsedCredentials.data
      
          // console.log('authConfig');
          
          // console.log({ email, password });
          

          // Buscar el correo
          const user = await prisma.user.findFirst({
            where: { email: email.toLowerCase() },
          })

          if (!user) return null

          // Comparar las contraseñas
          if ( !bcryptjs.compareSync(password, user.password)) return null


          // Regresar el usuario sin el password
          const { password: _, ...rest } = user

          // console.log(rest);
          
          return rest

      }
    })
  ]
}


export const { signIn, signOut, auth, handlers } = NextAuth( authConfig )