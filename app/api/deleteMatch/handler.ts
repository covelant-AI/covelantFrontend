// /app/api/deleteMatch/route.ts
import { PrismaClient } from "../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

async function deleteByMatchIds(ids: number[]) {
  if (!ids.length) return { error: "No ids provided" as const };

  const { count } = await prisma.match.deleteMany({
    where: { id: { in: ids } },
  });

  return { deleted: { matches: count } };
}

// DELETE — supports /api/deleteMatch?id=123 or JSON { id / ids / selectedIds }
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const qsIds = url.searchParams.getAll("id");
    const body = await req.json().catch(() => ({}));

    const raw = [
      ...(Array.isArray(body?.selectedIds) ? body.selectedIds : []),
      ...(Array.isArray(body?.ids) ? body.ids : []),
      ...(body?.id != null ? [body.id] : []),
      ...qsIds,
    ] as (number | string)[];

    const ids = raw.map((x) => Number(x)).filter((n) => Number.isFinite(n));
    if (!ids.length) {
      return NextResponse.json({ message: "No valid id(s) provided" }, { status: 400 });
    }

    const result = await deleteByMatchIds(ids);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: "Matches deleted", ids, ...result }, { status: 200 });
  } catch (error) {
    console.error("Error deleting match:", error);
    return NextResponse.json(
      { message: "Error deleting match", error: (error as Error).message },
      { status: 500 }
    );
  }
}


