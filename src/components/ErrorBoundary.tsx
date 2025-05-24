
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error details for debugging
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback onRetry={this.handleRetry} error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ onRetry: () => void; error?: Error }> = ({ onRetry, error }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg border border-red-200">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Noe gikk galt
      </h3>
      <p className="text-red-600 mb-4 max-w-md">
        Det oppstod en uventet feil. Prøv å laste siden på nytt.
      </p>
      {error && (
        <details className="mb-4 text-sm text-gray-600">
          <summary className="cursor-pointer">Tekniske detaljer</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-w-md">
            {error.message}
          </pre>
        </details>
      )}
      <Button onClick={onRetry} className="flex items-center gap-2">
        <RefreshCw size={16} />
        Prøv igjen
      </Button>
    </div>
  );
};

const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  return (
    <ErrorBoundaryClass fallback={fallback}>
      {children}
    </ErrorBoundaryClass>
  );
};

export default ErrorBoundary;
