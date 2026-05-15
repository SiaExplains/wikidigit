import { Author } from "@/types/article";

export const authors: Author[] = [
  {
    name: "Siavash Khalili",
    slug: "siavash",
    bio: "Senior tech journalist covering AI, startups, and the future of computing. Former engineer turned writer with a decade of experience in Silicon Valley.",
    avatar: "/images/authors/siavash.jpg",
    twitter: "siaexplains",
    linkedin: "siavashkhalili",
    articleCount: 12,
  },
  {
    name: "Siavash Ghanbari",
    slug: "siavash-ghanbari",
    bio: "Software developer and indie maker based in Berlin. Builds web products with AI tools and writes about the intersection of code, creativity, and the modern development stack.",
    avatar: "/images/authors/siavash.jpg",
    twitter: "siaexplains",
    linkedin: "siavashghanbari",
    articleCount: 1,
  },
  {
    name: "Maya Chen",
    slug: "maya-chen",
    bio: "Security researcher and journalist. Covers cybersecurity, privacy, and digital rights. Based in San Francisco.",
    avatar: "/images/authors/maya.jpg",
    twitter: "mayachen_sec",
    articleCount: 8,
  },
  {
    name: "Luca Romano",
    slug: "luca-romano",
    bio: "Developer advocate and technical writer. Specializes in open-source tooling, developer experience, and cloud infrastructure.",
    avatar: "/images/authors/luca.jpg",
    twitter: "lucaromano_dev",
    articleCount: 6,
  },
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}
