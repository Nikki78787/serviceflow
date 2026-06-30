import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: {
    strategy: "jwt",
    },

    pages: {
    signIn: "/login",
    },

    providers: [
    Credentials({
        name: "Email and Password",

        credentials: {
        email: {
            label: "Email",
            type: "email",
            placeholder: "you@example.com",
        },

        password: {
            label: "Password",
            type: "password",
            placeholder: "Enter your password",
            },
        },

        async authorize(credentials) {
        const validationResult = loginSchema.safeParse(credentials);

        if (!validationResult.success) {
            return null;
        }

        const { email, password } = validationResult.data;

        const user = await prisma.user.findUnique({
            where: {
            email: email.toLowerCase(),
            },
        });

        if (!user || !user.isActive) {
            return null;
        }

        const passwordMatches = await compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            return null;
        }

        return {
            id: user.id,
            name: user.name ?? user.email.split("@")[0],
            email: user.email,
            image: user.imageUrl,
        };
        },
    }),
    ],
});