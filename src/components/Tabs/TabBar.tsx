import { map } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import OptionsContainer from '../fields/components/OptionsContainer';
import Icon, { IconName } from '../other/Icons';

export interface Tab {
  label: string;
  slug?: string;
  value?: any;
  canDelete?: boolean;
}

const TabBar = ({
  tabs,
  className,
  onClick,
  isActive,
  onDelete,
  onAdd,
  addLabel,
  options,
  disabled = false,
}: {
  tabs: Tab[];
  onClick: (tab: Tab, index?: number) => void;
  isActive: (tab: Tab, index?: number) => boolean;
  onDelete?: (tab: Tab, index?: number) => void;
  onAdd?: (tab: Tab) => void;
  options?: Tab[];
  addLabel?: string;
  className?: string;
  disabled?: boolean;
}) => {
  const [showSelect, setShowSelect] = useState(false);
  const handleAdd = (option) => {
    if (!onAdd) return;

    setShowSelect(false);
    onAdd(option);
  };

  return (
    <Container className={className}>
      <TabButtonContainer>
        {map(tabs, (tab: Tab, index) => (
          <TabButton
            key={`tab-${index}`}
            isActive={isActive(tab, index)}
            onClick={() => {
              onClick(tab, index);
            }}
          >
            <TabLabel>{tab.label}</TabLabel>
            {!disabled && tab.canDelete && onDelete && (
              <IconContainer
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(tab);
                }}
              >
                <StyledIcon name={IconName.close} />
              </IconContainer>
            )}
          </TabButton>
        ))}
      </TabButtonContainer>

      {!disabled && onAdd && !!options?.length && (
        <RelativeContainer>
          <AddButton
            onClick={() => {
              setShowSelect(!showSelect);
            }}
          >
            {addLabel}
          </AddButton>
          <StyledOptionsContainer
            values={options}
            getOptionLabel={(option) => option?.label}
            showSelect={showSelect}
            handleClick={handleAdd}
          />
        </RelativeContainer>
      )}
    </Container>
  );
};

const StyledIcon = styled(Icon)`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  @media ${device.mobileL} {
    gap: 20px;
    flex-direction: column;
  }
`;

const AddButton = styled.div`
  cursor: pointer;
  width: fit-content;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.4rem;
  margin-top: 5px;
`;
const TabButtonContainer = styled.div`
  display: flex;
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

const RelativeContainer = styled.div`
  position: relative;
  vertical-align: bottom;
`;

const StyledOptionsContainer = styled(OptionsContainer)`
  top: 30px;
`;

export default TabBar;
