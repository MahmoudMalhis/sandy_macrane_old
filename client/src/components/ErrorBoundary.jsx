import { Component } from "react";
import Error from "../utils/Error";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Error error={this.state.error?.message || "حدث خطأ غير متوقع"} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
