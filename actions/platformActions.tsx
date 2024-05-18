"use server";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
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
    } catch (error) {}

    revalidatePath("/dashboard/platform");
};

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