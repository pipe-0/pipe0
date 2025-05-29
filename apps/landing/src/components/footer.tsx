import { appInfo } from "@/lib/const";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-6 lg:px-0 border-t dark:border-white/10 py-12 ">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                <a href={`mailto:${appInfo.emails.support}`}>
                  {appInfo.emails.support}
                </a>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm dark:text-muted-foreground dark:hover:text-white"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/resources/documentation"
                  className="text-sm dark:text-muted-foreground dark:hover:text-white"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm dark:text-muted-foreground dark:hover:text-white"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/pipe-catalog"
                  className="text-sm dark:text-muted-foreground dark:hover:text-white"
                >
                  Pipe Catalog
                </Link>
              </li>
              <li>
                <Link
                  rel="nofollow"
                  href={appInfo.links.signupUrl}
                  className="text-sm dark:text-muted-foreground dark:hover:text-white"
                >
                  Sign up
                </Link>
              </li>
              <li>
                <Link
                  rel="nofollow"
                  href={appInfo.links.loginUrl}
                  className="text-sm dark:text-muted-foreground dark:hover:text-white"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/resources/legal/privacy-policy/20250404"
                  className="text-sm dark:text-muted-foreground dark:hover:text-white"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/legal/terms-of-service/20250404"
                  className="text-sm dark:text-muted-foreground dark:hover:text-white"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          {/* <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Sales
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Status
                </Link>
              </li>
            </ul>
          </div> */}
        </div>
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {appInfo.productName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
