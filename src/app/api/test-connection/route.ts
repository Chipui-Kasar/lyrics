import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Test both connection types — each is its own persistent connection,
    // so report readyState from the connection objects themselves rather
    // than the (unused) global mongoose default connection.
    console.log("Testing regular connection...");
    const userConn = await connectMongoDB();
    const regularConnection = { readyState: userConn.readyState };

    console.log("Testing admin connection...");
    const adminConn = await connectMongoDB(true);
    const adminConnection = { readyState: adminConn.readyState };

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
