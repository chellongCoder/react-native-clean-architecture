import React, {Component, ErrorInfo, ReactNode} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {COLORS} from '../constants/colors';
import {firebase} from '@react-native-firebase/analytics';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  resetKey?: number | string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  private previousResetKey: number | string | undefined;
  private renderStart = 0;
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
    this.previousResetKey = props.resetKey;
    this.renderStart = performance.now();
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidUpdate(prevProps: Props): void {
    // Reset error state when resetKey changes
    if (
      this.state.hasError &&
      this.props.resetKey !== undefined &&
      this.props.resetKey !== prevProps.resetKey
    ) {
      this.setState({
        hasError: false,
        error: null,
      });
    }

    // Track thời gian render
    const renderTime = performance.now() - this.renderStart;
    if (renderTime > 100) {
      firebase.analytics().logEvent('slow_render', {
        component: this.constructor.name,
        render_time_ms: renderTime,
      });
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // You can log the error to a service like Firebase Crashlytics here
    firebase.analytics().logEvent('js_error', {
      error_message: error.message,
      error_stack: error.stack?.substring(0, 500), // limit length
      component_stack: errorInfo.componentStack?.substring(0, 500),
      timestamp: Date.now(),
    });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.resetError}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.WHITE,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.ERROR,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.BLACK,
  },
  button: {
    backgroundColor: COLORS.BLUE_20A7FF,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorBoundary;
