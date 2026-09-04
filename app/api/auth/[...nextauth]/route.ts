import NextAuth, { type NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { authenticateCredentials, findOrCreateGoogleUser } from "@/services/auth.service";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await authenticateCredentials(credentials.email, credentials.password);

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),

    /*
     * Google OAuth is optional.
     *
     * If credentials are not configured, the provider
     * is simply not registered.
     */
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      /*
       * Credentials authentication is already handled.
       */
      if (account?.provider === "credentials") {
        return true;
      }

      /*
       * Google authentication.
       */
      if (account?.provider === "google") {
        if (!user.email) {
          return false;
        }

        /*
         * Google must provide a verified email.
         */
        const googleProfile = profile as
          | {
              email_verified?: boolean;
            }
          | undefined;

        if (googleProfile?.email_verified === false) {
          return false;
        }

        try {
          const googleUser = await findOrCreateGoogleUser({
            googleId: account.providerAccountId,
            email: user.email,
            name: user.name,
            image: user.image,
          });

          /*
           * Attach our MongoDB identity to NextAuth's user.
           */
          user.id = googleUser.id;
          user.role = googleUser.role;
          user.name = googleUser.name;
          user.email = googleUser.email;
          user.image = googleUser.image;
        } catch (error) {
          console.error("Google sign-in error:", error);

          return false;
        }

        return true;
      }

      return false;
    },

    async jwt({ token, user }) {
      /*
       * First login.
       */
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";

        session.user.role = token.role === "admin" ? "admin" : "customer";
      }

      return session;
    },
  },

  events: {
    async signIn(message) {
      console.info(`BuzzieWorld sign-in: ${message.user.email ?? "unknown"}`);
    },
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
