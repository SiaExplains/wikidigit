import { MDXRemote } from "next-mdx-remote/rsc";
import MDXComponents from "@/components/mdx/MDXComponents";
import AdSlot from "@/components/ads/AdSlot";

interface ArticleBodyProps {
  content: string;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <div className="prose-article max-w-none">
      {/* AD: mid-article */}
      <AdSlot size="mid-article" position="mid-article" className="my-8" />
      <MDXRemote source={content} components={MDXComponents} />
    </div>
  );
}
