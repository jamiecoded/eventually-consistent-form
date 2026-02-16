import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const random = Math.random();

  if (random < 0.3) {
    await new Promise((resolve) => setTimeout(resolve, 7000));
    return NextResponse.json({ status: "success", requestId: body.requestId });
  }

  if (random < 0.6) {
    return new NextResponse("Temporary failure", { status: 503 });
  }

  return NextResponse.json({ status: "success", requestId: body.requestId });
}
