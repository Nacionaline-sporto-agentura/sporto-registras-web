import styled from 'styled-components';
import { device } from '../../../styles';
import { DeleteInfoProps } from '../../../types';
import BackButton from '../../buttons/BackButton';
import { DeleteComponent } from '../../other/DeleteComponent';

export const FormTitle = ({
  back = true,
  title,
  deleteInfo,
}: {
  back?: boolean;
  title: string;
  deleteInfo: DeleteInfoProps;
}) => {
  return (
    <Row>
      {back && <BackButton />}
      <InnerRow>
        <Title>{title}</Title>
        <DeleteComponent deleteInfo={deleteInfo} />
      </InnerRow>
    </Row>
  );
};

const Row = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const InnerRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const Title = styled.div`
  font-size: 3.2rem;
  font-weight: bold;
  color: #121926;
  opacity: 1;
  @media ${device.mobileL} {
    font-size: 2.4rem;
  }
`;
