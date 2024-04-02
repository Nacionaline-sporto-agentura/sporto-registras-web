import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Icon, { IconName } from '../other/Icons';

export interface TableItemProps {
  label?: string;
  url?: string;
  leftIconName?: string;
  rightIcon?: JSX.Element;
  leftIcon?: JSX.Element;
  showLeftIcon?: boolean;
}

const TableItem = ({
  label = '',
  url,
  leftIconName = IconName.eye,
  rightIcon,
  leftIcon,
}: TableItemProps) => {
  const navigate = useNavigate();

  if (!label) {
    return <>-</>;
  }

  const handleClick = (e) => {
    if (!url) return;

    e.stopPropagation();

    navigate(url);
  };

  return (
    <>
      <Container onClick={handleClick}>
        {(url || leftIcon) && (
          <IconContainer>{leftIcon || <StyledIcons name={leftIconName} />}</IconContainer>
        )}
        <Label>{label}</Label>
        {rightIcon && <IconContainer>{rightIcon}</IconContainer>}
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.div`
  font-size: 1.3rem;
  color: #121926;
  opacity: 1;
  white-space: nowrap;
`;

const StyledIcons = styled(Icon)`
  font-size: 1.6rem;
  vertical-align: middle;
  &:hover {
    opacity: 50%;
  }
`;

export default TableItem;
