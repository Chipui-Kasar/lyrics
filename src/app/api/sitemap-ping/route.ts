import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pingSearchEngines } from "@/lib/pingSearchEngines";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await pingSearchEngines();
    return NextResponse.json({ message: "Sitemap ping sent" });
  } catch (error) {
    console.error("Failed to ping sitemap:", error);
    return NextResponse.json(
      { message: "Failed to ping sitemap" },
      { status: 500 },
    );
  }
}
