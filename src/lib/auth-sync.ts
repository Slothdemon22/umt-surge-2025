import { prisma } from "./prisma";
import { supabase } from "./supabaseClient";

export async function syncUserToDB() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return;

  const existing = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!existing) {
    await prisma.user.create({
      data: { id: user.id, email: user.email!, role: "USER" },
    });
  }
}
