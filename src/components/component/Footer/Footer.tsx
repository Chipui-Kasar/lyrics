import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "All Lyrics", href: "/lyrics" },
    { name: "Artists", href: "/allartists" },
    { name: "Search", href: "/search" },
    { name: "Contribute", href: "/contribute" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ];

  const supportLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="footer-container border-t bg-background">
      <div className="footer-content container mx-auto mt-4 px-4 py-8 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
        {/* Main Footer Content */}
        <div className="footer-grid grid gap-8 md:grid-cols-2 grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="footer-brand space-y-4 col-span-2 lg:col-span-1">
            <h3 className="footer-title text-lg font-semibold text-foreground">
              Tangkhul Lyrics
            </h3>
            <p className="footer-description">
              Preserving Tangkhul cultural through music and lyrics. Discover,
              contribute, and celebrate our rich musical tradition.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section space-y-4">
            <h4 className="footer-section-title text-base font-medium text-foreground">
              Quick Links
            </h4>
            <ul className="footer-links space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name} className="footer-link-item">
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="footer-link text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section space-y-4">
            <h4 className="footer-section-title text-base font-medium text-foreground">
              Support
            </h4>
            <ul className="footer-links space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name} className="footer-link-item">
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="footer-link text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section space-y-4">
            <h4 className="footer-section-title text-base font-medium text-foreground">
              Legal
            </h4>
            <ul className="footer-links space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name} className="footer-link-item">
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="footer-link text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-bottom mt-8 border-t pt-6">
          <div className="footer-bottom-content flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <p className="footer-copyright text-sm text-muted-foreground">
              &copy; 2024 - {currentYear} Tangkhul Lyrics. All rights reserved.
            </p>

            {/* Additional Info */}
            <div className="footer-info flex flex-col items-center gap-2 text-sm text-muted-foreground md:flex-row md:gap-4">
              <span>Made with ❤️ for Tangkhul Community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
