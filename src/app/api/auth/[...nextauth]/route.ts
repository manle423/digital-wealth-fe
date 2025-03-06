import { API_URL } from "@/lib/Constants";
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshToken(token: JWT): Promise<JWT> {
  const res = await fetch(API_URL + "/auth/refresh", {
    method: "POST",
    headers: {
      authorization: `Refresh ${token.backendTokens.refreshToken}`,
    },
  });
  console.log("refreshed");

  const response = await res.json();

  return {
    ...token,
    backendTokens: response,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: {
          label: "Password",
          type: "password"
        },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const { email, password } = credentials;

        if (!email || !password) {
          return null;
        }

        const res = await fetch(API_URL + "/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
        if (res.status == 401) {
          console.log(res.statusText);
          return null;
        }

        const user = await res.json();
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log(token);
      if (user) return { ...token, ...user };

      if (new Date().getTime() < token.backendTokens.expiresIn)
        return token;

      return await refreshToken(token);
    },

    async session({ token, session }) {
      session.user = token.user;
      session.backendTokens = token.backendTokens;

      return session;
    },
  },
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };