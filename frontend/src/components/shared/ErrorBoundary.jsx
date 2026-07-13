import { Component } from 'react';

/**
 * ErrorBoundary — Catches React rendering errors and shows a fallback UI
 * instead of a blank white screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-icon">⚠️</div>
          <h2 className="error-boundary-title">Terjadi Kesalahan</h2>
          <p className="error-boundary-message">
            {this.state.error?.message || 'Halaman ini mengalami masalah saat dimuat.'}
          </p>
          <button className="error-boundary-btn" onClick={this.handleRetry}>
            Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
