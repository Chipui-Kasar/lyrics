import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Test both connection types
    console.log("Testing regular connection...");
    await connectMongoDB();
    const regularConnection = {
      readyState: require("mongoose").connection.readyState,
    };

    console.log("Testing admin connection...");
    await connectMongoDB(true);
    const adminConnection = {
      readyState: require("mongoose").connection.readyState,
    };

    return NextResponse.json({
      message: "Connection test completed",
      regular: regularConnection,
      admin: adminConnection,
      currentUserId: session.user.id,
    });
  } catch (error) {
    console.error("Connection test error:", error);
    return NextResponse.json(
      { error: "Connection test failed" },
      { status: 500 }
    );
  }
}
