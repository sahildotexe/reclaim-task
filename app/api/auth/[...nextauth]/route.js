import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email } = user;
        try {
          await connectMongoDB();
          const userExists = await User.findOne({ email });

          if (!userExists) {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Content-Length": "15 + name.length + email.length",
              },
              body: JSON.stringify({
                name,
                email,
              }),
            });

            if (res.ok) {
              return user;
            }
          } 
        } catch (error) {
          console.log(error);
        }
      }
      
      return user;
    },
  },

};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
