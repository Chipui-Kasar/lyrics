"use client";

import Link from "next/link";
import { ReactNode } from "react";

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
  return (
    <Link
      href={href}
      className={className}
      prefetch={prefetch}
      rel={rel}
      {...props}
    >
      {children}
    </Link>
  );
}
