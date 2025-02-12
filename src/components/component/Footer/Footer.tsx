import Link from "next/link";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background">
      <div className="container m-auto flex items-center justify-between py-4 text-sm text-muted-foreground flex-col md:flex-row">
        <p>&copy; {currentYear} Tangkhul Lyrical. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:underline" prefetch={true}>
            About
          </Link>
          <Link href="/contact" className="hover:underline" prefetch={true}>
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
