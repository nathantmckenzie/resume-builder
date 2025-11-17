export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-linear-to-b from-white to-gray-100">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Create Your Professional Resume
      </h1>

      <p className="text-gray-600 max-w-xl mb-8">
        Build a beautiful, ATS-friendly resume in minutes using our intuitive editor and
        modern templates.
      </p>

      <a
        href="/builder"
        className="px-6 py-3 bg-black text-white rounded-xl text-lg hover:bg-gray-900 transition"
      >
        Start Building →
      </a>

      <footer className="mt-16 text-gray-500 text-sm">Free. No signup required.</footer>
    </main>
  );
}
