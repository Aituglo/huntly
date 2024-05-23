import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
  const { oldPassword, newPassword } = await req.json();
  const session = await getServerSession(authOptions);

  if (!oldPassword || !newPassword || !session) {
    return new Response(JSON.stringify({ message: "Invalid inputs or not authenticated" }), { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        password: true,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    if (user.password === hashPassword(oldPassword)) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashPassword(newPassword) },
      });
      return new Response(JSON.stringify({ message: "Password updated successfully" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "Invalid old password" }), { status: 401 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ message: "Server error", error: e }), { status: 500 });
  }
}
