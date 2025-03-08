import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function Header() {
  return (
    <header className="px-6 lg:px-0 fixed top-0 w-full z-50 bg-black/50 backdrop-blur-sm border-b border-white/10">
      <div className="container flex items-center justify-between h-16 mx-auto">
        <Logo />
        <nav className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-300 hover:text-white"
          >
            Product
          </Link>
          <Link
            href="/blog"
            className="text-sm font-semibold text-gray-300 hover:text-white"
          >
            Blog
          </Link>
          <Link
            href="/docs"
            className="text-sm text-gray-300 font-semibold hover:text-white"
          >
            Documentation
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-gray-300 font-semibold hover:text-white"
          >
            Pricing
          </Link>
        </nav>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="hidden md:inline-flex border-gray-500 border-2"
            >
              Sign in
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Sign in</h4>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="Enter your username" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <Button className="w-full">Sign in</Button>
              <Separator />
              <Button variant="outline" className="w-full">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                >
                  <title>Google</title>
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                Sign in with Google
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
