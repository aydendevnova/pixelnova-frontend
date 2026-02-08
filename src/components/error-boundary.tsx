import { Component, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?:
    | ReactNode
    | ((props: { error: Error; reset: () => void }) => ReactNode);
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public reset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return typeof this.props.fallback === "function"
        ? this.props.fallback({
            error: this.state.error as Error,
            reset: this.reset,
          })
        : (this.props.fallback ?? <h1>Sorry.. there was an error</h1>);
    }

    return this.props.children;
  }
}
