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

/**
 * Thin wrapper around next/link. It used to intercept clicks to show a
 * full-screen overlay spinner; now Next's own navigation runs and the route's
 * loading.tsx ring spinner is the only loading indicator.
 */
export function NavigationLink({
  href,
  children,
  className,
  prefetch = true,
  rel,
  ...props
}: NavigationLinkProps) {
  return (
    <Link href={href} className={className} prefetch={prefetch} rel={rel} {...props}>
      {children}
    </Link>
  );
}
