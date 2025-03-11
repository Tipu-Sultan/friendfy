import CredentialsProvider from "next-auth/providers/credentials";
import authenticateUser from "@/utils/authenticateUser";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { 
          label: "Email or Username", 
          type: "text", 
          placeholder: "Enter email or username" 
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await authenticateUser(credentials.identifier, credentials.password);

          if (user?.error) {
            throw new Error(user.error);
          }

          return user;
        } catch (error) {
          console.error("Login failed:", error.message);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.profilePicture = user.profilePicture;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.profilePicture = token.profilePicture;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
