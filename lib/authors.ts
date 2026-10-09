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
    bio: "Writer at WikiDigit covering AI, startups, and the business of technology, with a focus on the people and decisions behind the headlines.",
  },
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}
