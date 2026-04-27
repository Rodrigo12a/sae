import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "@/src/features/auth/services/auth.service";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "SAE Institutional",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // El authService ahora maneja el bloqueo y los nuevos tipos de respuesta
          const data = await authService.login({
            email: credentials.email,
            password: credentials.password,
          });

          if (!data.success || !data.session) {
            throw new Error(data.error || "Login failed");
          }

          const { user, token } = data.session;

          return {
            id: user.id,
            name: user.name,
            role: user.role,
            accessToken: token,
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Error de autenticación institucional";
          console.error("NextAuth authorize error:", message);
          throw new Error(message);
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.uid = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.uid as string;
      session.user.role = token.role as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // Redirigir al login si hay error de credenciales
  },

  debug: process.env.NODE_ENV === "development" || !!process.env.DEBUG_AUTH,

  secret: process.env.NEXTAUTH_SECRET,

  logger: {
    error(code, metadata) {
      console.error("[NextAuth Error]", code, metadata);
    },
  },
});

export { handler as GET, handler as POST };