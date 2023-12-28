import styled from 'styled-components';
import { device } from '.';
import TabBar from '../components/other/TabBar';

export const FormRow = styled.div<{ columns?: number }>`
  display: grid;
  margin-top: 16px;
  grid-template-columns: repeat(${({ columns }) => columns || 3}, 1fr);
  gap: 16px;
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

export const FormColumn = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

export const LargeFormContainer = styled.div`
  margin: 0 20px 20px 20px;
  @media ${device.mobileL} {
    margin: 0 16px 20px 16px;
    padding: 0;
    width: auto;
    min-width: auto;
  }
`;

export const FormTitleRow = styled.div`
  display: flex;
  align-items: center;
  margin: 22px 0px 33px 0px;
  font-weight: bold;
  font-size: 2rem;
  line-height: 25px;
  color: #231f20;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 16px 0;
  @media ${device.mobileL} {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const TableButtonsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
  margin: 16px 0;
`;

export const TableButtonsInnerRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

export const Column = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

export const StyledTabBar = styled(TabBar)`
  margin: -8px -16px 16px -16px;
  padding: 0 16px;
`;

export const ViewContainer = styled.div`
  max-width: 1200px;
  min-width: 500px;
  margin: 0 auto 120px auto;
  padding: 0 16px;
  @media ${device.mobileL} {
    margin: 0 16px 20px 16px;
    padding: 0;
    width: auto;
    min-width: auto;
  }
`;

export const ViewRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 55px;
`;
export const ViewInnerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  @media ${device.mobileL} {
    flex-direction: column;
    align-items: flex-start;
  }
`;
export const ViewTitle = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #121926;
  line-height: 20px;
`;
