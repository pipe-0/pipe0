import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function LogoRaw() {
  return (
    <Image
      src="/logo-dark.svg"
      width={208}
      height={65}
      alt="logo-dark"
      className="w-20"
    />
  );
}

export function LinkLogo() {
  return (
    <Link href="/" className="text-xl font-bold font-mono">
      <LogoRaw />
    </Link>
  );
}

export function LogoSmall({ className }: { className?: string }) {
  return (
    <Link href="/" className="text-xl font-bold font-mono">
      <Image
        src="/logo-small-dark.svg"
        width={50}
        height={50}
        alt="logo-dark"
        className={cn("w-8", className)}
      />
    </Link>
  );
}
