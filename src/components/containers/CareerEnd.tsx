import { useState } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import { StyledInnerContainerRow } from '../../styles/CommonStyles';
import { descriptions, inputLabels, pageTitles } from '../../utils/texts';
import Switch from '../buttons/Switch';
import DateField from '../fields/DateField';

const CareerEnd = ({
  value,
  labels,
  handleChange,
  disabled,
}: {
  value: any;
  labels: { title: string; description: string };
  handleChange: (value: Date) => void;
  disabled: boolean;
}) => {
  const [isCareerEnded, setIsCareerEnded] = useState(!!value);
  return (
    <Container>
      <StyledInnerContainerRow title={pageTitles.careerEnd} description={descriptions.careerEnd} />
      <InnerContainer>
        <Row>
          <Column>
            <Title>{labels.title}</Title>
            <Description>{labels.description}</Description>
          </Column>
          <Switch
            disabled={disabled}
            value={isCareerEnded}
            onChange={() => setIsCareerEnded(!isCareerEnded)}
          />
        </Row>
        {isCareerEnded && (
          <FormColumn>
            <Line />
            <DateFieldContainer>
              <DateField
                disabled={disabled}
                name={'careerEndedAt'}
                label={inputLabels.careerEndDate}
                value={value}
                onChange={(val) => val && handleChange(val)}
              />
            </DateFieldContainer>
          </FormColumn>
        )}
      </InnerContainer>
    </Container>
  );
};

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: #eaeaef;
`;

const DateFieldContainer = styled.div`
  max-width: 350px;
  @media ${device.mobileM} {
    max-width: 100%;
  }
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 24px 0;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
`;

const InnerContainer = styled.div`
  width: 100%;
  border: 1px solid #eaeaef;
  padding: 24px;
  background-color: white;
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

export default CareerEnd;
