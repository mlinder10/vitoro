import Link from "next/link";
import LoginLink from "./login-link";

export default function AuthHeader() {
  return (
    <header className="flex items-center w-full h-header">
      <nav className="flex justify-between px-8 w-full">
        <Link href="/">
          <h1 className="font-bold text-2xl">Vitoro</h1>
        </Link>
        <ul>
          <li>
            <LoginLink />
          </li>
        </ul>
      </nav>
    </header>
  );
}
