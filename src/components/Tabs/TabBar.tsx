import { map } from 'lodash';
import styled from 'styled-components';

export interface Tab {
  label: string;
  slug?: string;
}

const TabBar = ({
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
          key={`tab-${index}`}
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
  flex: 1;
  white-space: nowrap;
  overflow-x: auto;
`;

const TabButton = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  border-bottom: ${({ isActive, theme }) =>
    `3px ${isActive ? theme.colors.primary : 'transparent'} solid`};
  margin-right: 24px;
  cursor: pointer;
`;

const TabLabel = styled.span`
  margin: 4px 0;
  color: #121926;
  font-size: 1.4rem;
`;

export default TabBar;
