import BundleBuilder from './BundleBuilder'
import ReviewPanel from './ReviewPanel'

export default function BundlePage() {
  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 lg:flex-row">
        <main className="w-full min-w-0 flex-1">
          <BundleBuilder />
        </main>

        <aside className="w-full shrink-0 lg:w-85">
          <ReviewPanel />
        </aside>
      </div>
    </div>
  )
}
