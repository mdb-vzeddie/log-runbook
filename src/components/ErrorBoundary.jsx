import React, { Component } from 'react';
import { Button } from '@mui/material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  handleClearStorageAndRestart = () => {
    localStorage.clear(); // Clear local storage
    window.location.reload(); // Reload the page to restart the app
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h1>Looks like something went wrong somewhere... Sorry!</h1>
          <p>{this.state.error && this.state.error.toString()}</p>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={this.handleClearStorageAndRestart}
          >
            Clear Data and Restart App
          </Button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;