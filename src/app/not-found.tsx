import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[calc(100vh-10rem)] place-items-center">
      <div className="text-center">
        <h1 className="text-bold mb-1 text-2xl capitalize tracking-wide">
          404 | Page not found
        </h1>
        <p className="mb-7 tracking-wide">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          href={"/"}
          className="rounded-sm bg-black px-4 py-2 tracking-wider text-white hover:bg-gray-700"
        >
          Go back to homepage
        </Link>
      </div>
    </main>
  );
}
