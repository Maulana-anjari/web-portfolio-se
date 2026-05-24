import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#666666] mb-4 block">
              // SYSTEM_EXCEPTION_CAUGHT
            </span>
            <div className="text-red-400 font-mono text-sm mb-4 border border-red-400/30 rounded px-4 py-3 bg-red-400/5 break-all">
              {this.state.error?.message || "Unknown error"}
            </div>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-2 border border-neon-mint text-neon-mint font-mono text-sm uppercase tracking-widest hover:bg-neon-mint hover:text-black transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
