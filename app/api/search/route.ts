import { NextRequest, NextResponse } from "next/server";
import { getAllArticles } from "@/lib/mdx";

export function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim() ?? "";

  if (!q) {
    return NextResponse.json({ articles: [] });
  }

  const all = getAllArticles();
  const results = all.filter((a) => {
    const haystack = [
      a.title,
      a.description,
      a.author,
      a.category,
      ...(a.tags || []),
    ]
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).every((word) => haystack.includes(word));
  });

  return NextResponse.json({ articles: results.slice(0, 20) });
}
