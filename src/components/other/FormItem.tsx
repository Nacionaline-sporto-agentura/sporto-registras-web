import styled from 'styled-components';
import { device } from '../../styles';
import { ChildrenType } from '../../types';
import { buttonsTitles } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import Icon, { IconName } from './Icons';

export const FormItem = ({
  onDelete,
  children,
  title,
}: {
  onDelete?: () => void;
  children: ChildrenType;
  title?: any;
}) => {
  return (
    <Container>
      <TopRow>
        {title}

        {onDelete && (
          <StyledButton
            onClick={onDelete}
            variant={ButtonColors.TRANSPARENT}
            type="button"
            leftIcon={<StyledIcon name={IconName.deleteItem} />}
          >
            {buttonsTitles.delete}
          </StyledButton>
        )}
      </TopRow>

      {children}
    </Container>
  );
};

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.colors.danger};
  border: none;
  padding: 0;
  font-size: 1.2rem;
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  height: 15px;
  color: ${({ theme }) => theme.colors.danger};
  @media ${device.mobileL} {
    margin: 0;
  }
`;

const Container = styled.div`
  padding: 16px;
  gap: 16px;
  width: 100%;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;
