import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Artist } from "@/models/model";

export async function POST(req: Request) {
  const { name, genre, socialLinks, village } = await req.json();
  await connectMongoDB();
  await Artist.create({ name, genre, socialLinks, village });
  return NextResponse.json(
    { message: "Artist created successfully" },
    { status: 201 }
  );
}
export async function GET() {
  await connectMongoDB();
  const artists = await Artist.find();
  return NextResponse.json(artists);
}

export async function DELETE(req: {
  nextUrl: { searchParams: { get: (arg0: string) => any } };
}) {
  // const { id } = await req.json();
  const id = req.nextUrl.searchParams.get("id");

  await connectMongoDB();
  await Artist.findByIdAndDelete(id);
  return NextResponse.json(
    { message: "Artist deleted successfully" },
    {
      status: 200,
    }
  );
}
