import { Author } from "@/types/article";

export const authors: Author[] = [
  {
    name: "Siavash Ghanbari",
    slug: "siavash-ghanbari",
    bio: "Software developer and indie maker based in Berlin. Builds web products with AI tools and writes about the intersection of code, creativity, and the modern development stack.",
    twitter: "siaexplains",
    linkedin: "siavashghanbari",
  },
  {
    name: "Sheida Mohassesy",
    slug: "sheida-mohassesy",
    bio: "Product designer and founder based in Berlin. Founded FocusCrew, a focus timer built around body doubling, and is co-CEO of the AI agency GoAll.ai, where she works on AI products and the automation behind them. Writes about AI, startups and the people building them.",
    avatar: "/images/authors/sheida-mohassesy.jpg",
    linkedin: "sheida-mohassesy",
  },
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}
