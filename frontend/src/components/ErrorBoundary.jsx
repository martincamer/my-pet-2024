import React from "react";
import styled from "styled-components";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // Aquí podrías enviar el error a un servicio de logging
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Algo salió mal</ErrorTitle>
          <ErrorMessage>
            Lo sentimos, ha ocurrido un error. Por favor, intenta recargar la
            página.
          </ErrorMessage>
          <RetryButton onClick={() => window.location.reload()}>
            Recargar página
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  color: #dc2626;
  font-size: 24px;
  margin-bottom: 16px;
`;

const ErrorMessage = styled.p`
  color: #4b5563;
  margin-bottom: 24px;
`;

const RetryButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

export default ErrorBoundary;
