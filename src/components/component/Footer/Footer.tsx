import Link from "next/link";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background">
      <div className="container m-auto flex items-center justify-between py-4 text-sm text-muted-foreground">
        <p>&copy; {currentYear} Tangkhul Lyrical. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:underline" prefetch={false}>
            About
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Contact
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Privacy
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
