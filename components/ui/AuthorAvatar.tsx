import Image from "next/image";
import Link from "next/link";

interface AuthorAvatarProps {
  name: string;
  slug: string;
  avatar?: string;
  size?: number;
  showName?: boolean;
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
}: AuthorAvatarProps) {
  const initials = getInitials(name);

  return (
    <Link href={`/authors/${slug}`} className="flex items-center gap-2 group">
      <div
        className="rounded-full overflow-hidden bg-primary flex items-center justify-center text-cream font-semibold flex-shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.38 }}
      >
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
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
    </Link>
  );
}
