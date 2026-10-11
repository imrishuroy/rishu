export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-6 w-full flex items-center justify-center">
        <span className="text-label-sm text-on-surface-variant font-mono">
          © {new Date().getFullYear()} Rishu Kumar
        </span>
      </div>
    </footer>
  )
}
