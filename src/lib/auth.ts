import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          await connectMongoDB(true);

          console.log("Looking for user with email:", credentials.email);
          const user = await User.findOne({ email: credentials.email });
          console.log("User found:", user ? "Yes" : "No");
          if (user) {
            console.log("User details:", {
              id: user._id,
              email: user.email,
              name: user.name,
            });
          }

          if (user && bcrypt.compareSync(credentials.password, user.password)) {
            console.log("Password match: Yes");
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
          console.log("Password match: No");
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // Refresh token every 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }

      // Check if user still exists during JWT callback (only when token already exists)
      if (token?.id && !user) {
        try {
          await connectMongoDB();
          const existingUser = await User.findById(token.id);

          if (!existingUser) {
            // User has been deleted, mark token as invalid
            console.log(
              "User not found in database, marking token as invalid:",
              token.id
            );
            // @ts-ignore
            token.deletedUser = true;
            // @ts-ignore
            token.id = undefined;
            // @ts-ignore
            token.role = undefined;
          } else {
            // Update token with current user role
            // @ts-ignore
            token.role = existingUser.role;
            // @ts-ignore
            token.deletedUser = false;
          }
        } catch (error) {
          console.error("JWT validation error:", error);
          // @ts-ignore
          token.deletedUser = true;
          // @ts-ignore
          token.id = undefined;
          // @ts-ignore
          token.role = undefined;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      if (token?.deletedUser) {
        // User was deleted, invalidate session
        throw new Error("Session invalid - user account deleted");
      }

      if (token?.id) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }

  interface User {
    id: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
  }
}
