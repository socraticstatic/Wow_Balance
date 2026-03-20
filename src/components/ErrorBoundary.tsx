import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error: string }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="px-6 py-16 text-center">
          <p className="text-sm font-bold mb-2" style={{ color: 'var(--color-error)' }}>Section failed to load</p>
          <p className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{this.state.error}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
