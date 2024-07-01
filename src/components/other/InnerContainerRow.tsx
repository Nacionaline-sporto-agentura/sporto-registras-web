import styled from 'styled-components';
import Button from '../buttons/Button';

const InnerContainerRow = ({
  title,
  description,
  buttonTitle,
  disabled,
  onCreateNew,
  className,
}: any) => (
  <Column className={className}>
    <TableButtonsRow>
      <Title>{title}</Title>
      {!disabled && onCreateNew && <Button onClick={onCreateNew}>{buttonTitle}</Button>}
    </TableButtonsRow>
    <Description>{description}</Description>
  </Column>
);

const TableButtonsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #231f20;
  margin-right: 16px;
`;

const Description = styled.div`
  font-size: 1.6rem;
  color: #697586;
  opacity: 1;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 32px 0;
`;

export default InnerContainerRow;
