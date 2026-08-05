import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import PageTransition from '../../components/ui/PageTransition'
import ErrorBoundary from '../../components/ErrorBoundary'

export default function MainLayout() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* mode="wait" removed on purpose — it makes AnimatePresence block
            the new page's enter animation until the old one's exit
            finishes, which is exactly the mechanism behind the stuck-
            invisible-content bug found on the dashboard. Default (sync)
            mode animates both at once with no such dependency. */}
        <AnimatePresence>
          <PageTransition key={location.pathname}>
            <ErrorBoundary key={location.pathname}>
              <Outlet />
            </ErrorBoundary>
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
