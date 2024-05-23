import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const session = await getServerSession(authOptions);

  if (!email || !password || !session) {
    return new Response(JSON.stringify({ message: "Invalid inputs or not authenticated" }), { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        password: true,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    if (user.password === hashPassword(password)) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { email: email },
      });

    
      session.user.email = email; 

      return new Response(JSON.stringify({ message: "Email updated successfully" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "Invalid password" }), { status: 401 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ message: "Server error", error: e }), { status: 500 });
  }
}
