import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
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
      {/* remark-gfm: tables (and other GitHub-flavoured Markdown) render as HTML, not pipe text. */}
      <MDXRemote
        source={content}
        components={MDXComponents}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}
