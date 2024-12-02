import styled from "styled-components";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccesoDenegado = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Card>
        <IconWrapper>
          <Shield size={48} />
        </IconWrapper>
        <Title>Acceso Denegado</Title>
        <Message>
          No tienes los permisos necesarios para acceder a esta página.
        </Message>
        <Description>
          Si crees que esto es un error, por favor contacta al administrador del
          sistema.
        </Description>
        <ButtonGroup>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Volver
          </BackButton>
          <HomeButton onClick={() => navigate("/")}>Ir al Inicio</HomeButton>
        </ButtonGroup>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f3f4f6;
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  max-width: 28rem;
  width: 100%;
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background-color: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;

  svg {
    color: #dc2626;
  }
`;

const Title = styled.h1`
  color: #111827;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #374151;
  font-size: 1rem;
  margin-bottom: 0.75rem;
`;

const Description = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BackButton = styled(Button)`
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const HomeButton = styled(Button)`
  background-color: #3b82f6;
  color: white;
  border: none;

  &:hover {
    background-color: #2563eb;
  }
`;

export default AccesoDenegado;
