
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon, ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  providerName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class OfferErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('OfferErrorBoundary caught an error:', error, errorInfo);
    
    // Log to Supabase in production
    this.logComponentError(error, errorInfo);
  }

  private logComponentError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In a real implementation, this would log to Supabase
      console.log('Logging component error:', {
        provider: this.props.providerName,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.error('Failed to log component error:', logError);
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            <ClockIcon className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-red-700 text-sm mb-2">
            Temporary data issue - showing cached version
          </p>
          {this.props.providerName && (
            <p className="text-gray-600 text-xs mb-3">
              Provider: {this.props.providerName}
            </p>
          )}
          <Button 
            onClick={this.handleRetry}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default OfferErrorBoundary;
