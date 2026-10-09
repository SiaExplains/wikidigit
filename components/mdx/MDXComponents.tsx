import Image from "next/image";
import Link from "next/link";
import { Children, isValidElement, type ReactNode } from "react";
import type { MDXComponents as MDXComponentsType } from "mdx/types";
import { headingId } from "@/lib/utils";

// Visible text of a heading, so its id matches the one extractHeadings builds for the TOC.
function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return textOf(child.props.children);
      return "";
    })
    .join("");
}

const MDXComponents: MDXComponentsType = {
  h2: ({ children, ...props }) => (
    <h2 id={headingId(textOf(children))} className="scroll-mt-24" {...props}>
      {children}
    </h2>
  ),

  h3: ({ children, ...props }) => (
    <h3 id={headingId(textOf(children))} className="scroll-mt-24" {...props}>
      {children}
    </h3>
  ),

  a: ({ href = "", children, ...props }) => {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    }
    return <Link href={href}>{children}</Link>;
  },

  img: ({ src = "", alt = "" }) => (
    <span className="block my-8 relative aspect-video rounded-sm overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 720px"
      />
    </span>
  ),

  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),

  th: ({ children, ...props }) => (
    <th
      className="text-left font-semibold text-ink bg-cream-dark px-4 py-2 border border-ink/10"
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }) => (
    <td className="px-4 py-2 border border-ink/10 font-sans text-ink/80" {...props}>
      {children}
    </td>
  ),

  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-primary pl-5 py-1 my-6 italic text-muted"
      {...props}
    >
      {children}
    </blockquote>
  ),
};

export default MDXComponents;
