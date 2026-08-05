import React from 'react'

/**
 * ErrorBoundary — catches render/runtime errors in whatever it wraps and
 * shows a visible, diagnosable message instead of a silent blank screen.
 *
 * This was added specifically because a page going completely blank (no
 * header, no content, nothing) with the rest of the app still working is
 * the classic signature of an uncaught render error with no boundary to
 * catch it — React just quietly unmounts that subtree. Wrapping each
 * dashboard route in this means that failure mode becomes impossible:
 * you'll always see either the real UI or a clear error card, never
 * nothing.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[BuddyBee] Caught render error:', error, info?.componentStack)
  }

  handleRetry = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] p-6">
          <div className="max-w-md w-full bg-white/95 backdrop-blur-sm border border-red-100 rounded-2xl shadow-card p-6 text-center">
            <div className="text-4xl mb-3">🐝💔</div>
            <h2 className="font-display font-bold text-slate-900 mb-2">This page hit a snag</h2>
            <p className="text-sm text-slate-500 mb-4">
              Something went wrong while loading this. The technical details below will help pinpoint the exact cause.
            </p>
            <pre className="text-left text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 mb-4 overflow-auto max-h-32 whitespace-pre-wrap break-words">
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
