"use server";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import YesWeHack from "@/lib/yeswehack";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

const platforms = [
  {"slug": "hackerone", "name": "HackerOne", "type": "public"},
  {"slug": "yeswehack", "name": "Yes We Hack", "type": "public"},
]

export const createPlatform = async (data: any) => {
    const session = await getServerSession(authOptions);
    const slug = data.platform;
    const platform = platforms.find((platform) => platform.slug === slug);

    try {
        await prisma.platform.create({
            data: {
                name: platform?.name,
                slug: platform?.slug,
                type: platform?.type,
                email: data.email,
                password: data.password,
                otp: data.otp,
                userId: session?.user.id,
            },
        });

        switch (slug) {
            case "yeswehack":
                const username = await YesWeHack.getUsername(session?.user.id);

                if (username) {
                    await prisma.platform.update({
                        where: {
                            userId: session?.user.id,
                            slug: "yeswehack",
                        },
                        data: {
                            hunterUsername: username,
                        },
                    });
                }
                break;
            case "hackerone":
                await prisma.platform.update({
                    where: {
                        userId: session?.user.id,
                        slug: "hackerone",
                    },
                    data: {
                        hunterUsername: data.email,
                    },
                });
                break;
            default:
                return;
        }
    } catch (error) {
        console.log(error)
    }

    revalidatePath("/dashboard/platform");
};

export const updatePlatform = async (id: string, data: any) => {
    const session = await getServerSession(authOptions);

    try {
        await prisma.platform.update({
            where: {
                id: id,
                userId: session?.user.id,
            },
            data: {
                email: data.email,
                password: data.password,
                otp: data.otp,
            },
        });
    } catch (error) {
        console.log(error)
    }

    revalidatePath("/dashboard/platform");
}

export const deletePlatform = async (id: string) => {
    const session = await getServerSession(authOptions);

    try {
        await prisma.platform.delete({
            where: {
                id: id,
                userId: session?.user.id,
            },
        });
    } catch (error) {}

    revalidatePath("/dashboard/platform");
};