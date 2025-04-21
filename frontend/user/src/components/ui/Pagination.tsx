import { Link } from "@inertiajs/react";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
}

export default function Pagination({ links }: PaginationProps) {
  if (!links.length) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-6 flex-wrap">
      {links.map((link, i) => {
        const label = link.label.replace(/&laquo;|&raquo;/g, "").trim();
        return link.url ? (
          <Link
            key={i}
            href={link.url}
            className={`px-3 py-1 text-sm rounded-md border transition
              ${link.active
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-accent"}`}
            dangerouslySetInnerHTML={{ __html: label }}
          />
        ) : (
          <span
            key={i}
            className="px-3 py-1 text-sm text-muted-foreground bg-muted rounded-md"
            dangerouslySetInnerHTML={{ __html: label }}
          />
        );
      })}
    </div>
  );
}
