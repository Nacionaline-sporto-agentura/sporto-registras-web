import { map } from 'lodash';
import styled from 'styled-components';

export interface Tab {
  label: string;
  slug?: string;
}

const TabSideBar = ({
  tabs,
  className,
  onClick,
  isActive,
}: {
  tabs: Tab[];
  onClick: (tab: Tab, index?: number) => void;
  isActive: (tab: Tab, index?: number) => boolean;
  className?: string;
}) => {
  return (
    <Container className={className}>
      {map(tabs, (tab: Tab, index) => (
        <TabButton
          key={`tab-sidebar-${index}`}
          isActive={isActive(tab, index)}
          onClick={() => {
            onClick(tab, index);
          }}
        >
          <TabLabel>{tab.label}</TabLabel>
        </TabButton>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
`;

const TabButton = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ isActive, theme }) =>
    `${isActive ? theme.colors.secondary : 'transparent'}`};
  padding: 12px;
  cursor: pointer;
  border-radius: 4px;
`;

const TabLabel = styled.span`
  color: black;
  font-size: 1.4rem;
  overflow: hidden;
  white-space: nowrap;
`;

export default TabSideBar;
