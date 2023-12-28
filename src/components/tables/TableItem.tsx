import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export interface TableItemProps {
  items?: { label?: string; url: string }[];
}

const TableItem = ({ items }: TableItemProps) => {
  const navigate = useNavigate();

  if (!items || isEmpty(items)) {
    return <>-</>;
  }

  return (
    <Row>
      {items.map((item) => {
        return (
          <Container key={JSON.stringify(item)} onClick={() => navigate(item.url)}>
            <Label>{item.label}</Label>
          </Container>
        );
      })}
    </Row>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.div`
  font-size: 1.3rem;
  color: #121926;
  white-space: nowrap;
`;

export default TableItem;
