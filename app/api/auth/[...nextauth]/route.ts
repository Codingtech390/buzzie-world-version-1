import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
