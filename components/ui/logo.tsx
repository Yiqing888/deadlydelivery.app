import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex" aria-label="Deadly Delivery Run Planner">
      <Image
        src="/images/logo.png"
        alt="Deadly Delivery Logo"
        width={32}
        height={32}
        className="rounded-sm"
      />
    </Link>
  );
}
