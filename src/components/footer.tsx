import { constants } from "@/lib/const";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-6 lg:px-0 border-t border-white/10 py-12 bg-black ">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-400 hover:text-white"
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
                  href="/docs"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal/privacy-policy"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms-of-service"
                  className="text-sm text-gray-400 hover:text-white"
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
            © {new Date().getFullYear()} {constants.productName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
