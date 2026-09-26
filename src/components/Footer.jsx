export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white px-6 py-10 text-center sm:px-8">
      <p className="font-script text-2xl text-mint-600">let&apos;s build something together</p>
      <p className="mt-3 text-sm text-ink-soft">
        hello@fgulbent.ca — Ottawa, Canada
      </p>
      <p className="mt-6 text-xs text-ink-soft/70">
        © {new Date().getFullYear()} Feyza Gulbent. Made with a little too much care.
      </p>
    </footer>
  )
}
