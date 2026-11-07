import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, ChevronDown } from 'lucide-react'
import { Button } from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-modal animate-scale-in space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200/60 dark:border-amber-800/60 shadow-sm">
              <AlertTriangle size={28} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Application encounter an issue
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Resolution Support AI encountered an unexpected error while rendering this view. Your saved settings and active tickets are intact.
              </p>
            </div>

            {/* Error details preview */}
            {this.state.error && (
              <div className="text-left">
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 mx-auto"
                >
                  <span>{this.state.showDetails ? 'Hide technical details' : 'Show technical details'}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${this.state.showDetails ? 'rotate-180' : ''}`}
                  />
                </button>

                {this.state.showDetails && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-36 border border-slate-800">
                    <p className="font-bold text-red-400">{this.state.error.toString()}</p>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="mt-1 text-[10px] text-slate-500 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Button
                size="sm"
                onClick={this.handleReset}
                leftIcon={<RefreshCw size={14} />}
                className="w-full sm:w-auto"
              >
                Reload & Recover
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  window.location.href = '/'
                }}
                leftIcon={<Home size={14} />}
                className="w-full sm:w-auto"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
