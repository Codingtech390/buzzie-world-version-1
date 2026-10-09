import NextAuth, { type NextAuthOptions } from "next-auth";

import { firebaseAdminAuth } from "@/lib/firebase/admin";
import CredentialsProvider from "next-auth/providers/credentials";

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

    CredentialsProvider({
      id: "firebase-google",
      name: "Firebase Google",

      credentials: {
        idToken: {
          label: "Firebase ID Token",
          type: "text",
        },
      },

      async authorize(credentials) {
        const idToken = typeof credentials?.idToken === "string" ? credentials.idToken : "";

        if (!idToken) {
          return null;
        }

        try {
          const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);

          const email = decodedToken.email;

          if (!email) {
            return null;
          }

          /*
           * Firebase has already authenticated the Google identity.
           * Create/find the corresponding MongoDB user.
           */
          const googleUser = await findOrCreateGoogleUser({
            googleId: decodedToken.uid,
            email,
            name: decodedToken.name ?? null,
            image: decodedToken.picture ?? null,
          });

          return {
            id: googleUser.id,
            name: googleUser.name,
            email: googleUser.email,
            image: googleUser.image,
            role: googleUser.role,
          };
        } catch (error) {
          console.error("Firebase Google authentication error:", error);

          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "credentials" || account?.provider === "firebase-google") {
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
