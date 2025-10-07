import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    // Check if user still exists in database
    await connectMongoDB(); // Regular connection is fine for read operations
    const existingUser = await User.findById(session.user.id);

    if (!existingUser) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Session is valid",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json(
      { error: "Session validation failed" },
      { status: 401 }
    );
  }
}
