import Image from "next/image";
import Link from "next/link";
import { getAuthorBySlug } from "@/lib/authors";

interface AuthorAvatarProps {
  name: string;
  slug: string;
  avatar?: string;
  size?: number;
  showName?: boolean;
  // Set false when the avatar already sits inside a link.
  linked?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AuthorAvatar({
  name,
  slug,
  avatar,
  size = 32,
  showName = false,
  linked = true,
}: AuthorAvatarProps) {
  const initials = getInitials(name);
  // Callers that only know the byline (name + slug) still get the author's photo.
  const src = avatar ?? getAuthorBySlug(slug)?.avatar;

  const content = (
    <>
      <div
        className="rounded-full overflow-hidden bg-primary flex items-center justify-center text-cream font-semibold flex-shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.38 }}
      >
        {src ? (
          <Image
            src={src}
            // The name is printed right next to it, so don't make screen readers read it twice.
            alt={showName ? "" : name}
            width={size}
            height={size}
            className="object-cover w-full h-full"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {showName && (
        <span className="text-sm font-medium text-ink group-hover:text-rust transition-colors">
          {name}
        </span>
      )}
    </>
  );

  if (!linked) return <span className="flex items-center gap-2 group">{content}</span>;

  return (
    <Link href={`/authors/${slug}`} className="flex items-center gap-2 group">
      {content}
    </Link>
  );
}
