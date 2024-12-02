import styled from "styled-components";

const CardContainer = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CardTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 3px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`;

const Card = ({ title, value, valueColor }) => {
  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      <p className={`text-3xl ${valueColor}`}>{value}</p>
    </CardContainer>
  );
};

export { Card, CardGrid };
