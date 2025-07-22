import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    // Add any custom user fields here
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      // Add any custom session fields here
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    // Add any custom token fields here
  }
}
