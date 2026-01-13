"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode } from "react";

interface NavigationLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  rel?: string;
  [key: string]: any;
}

export function NavigationLink({
  href,
  children,
  className,
  prefetch = true,
  rel,
  ...props
}: NavigationLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Don't interfere with modified clicks (ctrl, shift, meta)
    if (e.ctrlKey || e.shiftKey || e.metaKey || e.button !== 0) {
      return;
    }

    // Don't interfere with external links
    if (href.startsWith("http") || href.startsWith("//")) {
      return;
    }

    e.preventDefault();

    // Dispatch navigation start event to show spinner
    window.dispatchEvent(new Event("navigationStart"));

    // Navigate
    router.push(href);

    // Set a timeout to hide spinner if navigation takes too long
    setTimeout(() => {
      window.dispatchEvent(new Event("navigationEnd"));
    }, 3000);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      prefetch={prefetch}
      rel={rel}
      {...props}
    >
      {children}
    </Link>
  );
}
