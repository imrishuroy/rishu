import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      {/* Ambient glow */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary-container/10 blur-[100px] pointer-events-none rounded-full -z-10" />

      <div className="flex flex-col items-center gap-6">
        {/* Terminal error log line */}
        <span className="text-error font-mono text-label-md">
          error: route not found
        </span>

        {/* Large 404 */}
        <p className="text-[6rem] font-mono font-bold text-primary leading-none">
          404
        </p>

        {/* Headline */}
        <h1 className="text-headline-xl text-on-surface">Page not found</h1>

        {/* Sub-text */}
        <p className="text-body-lg text-on-surface-variant max-w-md">
          The route you requested doesn&apos;t exist. It may have been removed or the URL is incorrect.
        </p>

        {/* Go-style stack trace block */}
        <div className="font-mono text-xs text-on-surface-variant bg-surface-container-low border border-outline-variant/30 rounded-lg p-4 text-left max-w-sm w-full">
          <p>goroutine 1 [running]:</p>
          <p>main.handleRequest(path=&quot;/this-page&quot;)</p>
          <p className="pl-4">→ handler.go:42 +0x68</p>
          <p>net/http.serve(conn=0xc00012e000)</p>
          <p className="pl-4">→ server.go:3086 +0x5dd</p>
        </div>

        {/* Back to Home button */}
        <Button href="/" className="w-fit">
          <span className="material-symbols-outlined">home</span>
          Back to Home
        </Button>
      </div>
    </div>
  )
}
