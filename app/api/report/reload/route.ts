import YesWeHack from "@/lib/yeswehack";
import Hackerone from "@/lib/hackerone";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");

  try {
    const platforms = await prisma.platform.findMany({
      where: {
        userId: session.user.id,
      },
    });

    platforms.forEach(async (platform) => {
      switch (platform.slug) {
        case "yeswehack":
          await YesWeHack.reloadReports(session.user.id, platform.id);
          break;
        case "hackerone":
          await Hackerone.reloadReports(session.user.id, platform.id);
          break;
        default:
          return;
      }
    }
    );

    return Response.json({ message: "reports reloaded" });
    
  } catch (e) {
    throw new Error(e);
  }
}