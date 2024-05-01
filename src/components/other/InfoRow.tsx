import React from 'react';
import styled from 'styled-components';
import { device } from '../../styles';

const InfoRow = ({ info }) => (
  <Row>
    {info
      ?.filter((item) => item)
      .map((item, index, arr) => {
        const isValidElement = React.isValidElement(item);
        const isNextValidElement = React.isValidElement(arr[index + 1]);

        const element = !isValidElement ? <Label>{item}</Label> : item;

        return (
          <InnerRow key={`tenant-info-${index}`}>
            {element} {arr?.length !== index + 1 && <Dot show={!isNextValidElement} />}
          </InnerRow>
        );
      })}
  </Row>
);
const InnerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  @media ${device.mobileL} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Dot = styled.div<{ show: boolean }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${({ show }) => (show ? '#697586' : 'transparent')};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  @media ${device.mobileL} {
    flex-direction: column;
    margin-top: 12px;
    align-items: flex-start;
  }
`;

const Label = styled.div`
  font-size: 1.6rem;
  line-height: 20px;
  color: #697586;
  opacity: 1;
`;

export default InfoRow;
