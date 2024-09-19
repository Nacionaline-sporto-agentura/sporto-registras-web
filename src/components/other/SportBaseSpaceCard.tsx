import styled from 'styled-components';
import { SportBaseSpace } from '../../types';
import { buttonsTitles } from '../../utils/texts';
import StatusTag from './StatusTag';

export interface SimpleContainerProps {
  className?: string;
  sportBaseSpace: SportBaseSpace;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const SportBaseSpaceCard = ({
  className,
  sportBaseSpace,
  onEdit,
  disabled,
  onDelete,
}: SimpleContainerProps) => {
  if (!sportBaseSpace) return <></>;

  const {
    name = '',
    technicalCondition = { name: '', color: '' },
    type = { name: '' },
    sportTypes = {},
  } = sportBaseSpace;

  return (
    <Container className={className}>
      <Row>
        <TitleRow>
          <Title>{name}</Title>
          <StatusTag label={technicalCondition?.name} color={technicalCondition?.color} />
        </TitleRow>
        <TitleRow>
          {!disabled && <Action onClick={onDelete}>{buttonsTitles.delete}</Action>}
          <Action onClick={onEdit}>{disabled ? buttonsTitles.view : buttonsTitles.edit}</Action>
        </TitleRow>
      </Row>
      <Type>{type?.name}</Type>
      <Line />
      <TitleRow>
        {sportTypes &&
          Object.values(sportTypes)?.map((type: any) => (
            <StatusTag key={type.id + 'sportType'} label={type.name} />
          ))}
      </TitleRow>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  padding: 16px;
`;

const Line = styled.div`
  width: 100%;
  background-color: #e5e7eb;
  height: 1px;
  margin: 16px 0;
`;

const Title = styled.div`
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 19.36px;
  color: #231f20;
`;
const Type = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 16.94px;
  margin-top: 12px;
`;

const TitleRow = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Action = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 16.94px;
  color: #003d2b;
  cursor: pointer;
`;

export default SportBaseSpaceCard;
