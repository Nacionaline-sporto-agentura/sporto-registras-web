import styled from 'styled-components';
import Icon from './Icons';

export interface AvatarProps {
  name: string;
  surname: string;
  className?: string;
  active?: boolean;
  mini?: boolean;
  selected?: boolean;
}

const Avatar = ({
  name = '',
  surname = '',
  className,
  active,
  mini,
  selected = false,
}: AvatarProps) => {
  if (selected) {
    return (
      <SelectedContainer mini={mini}>
        <StyledIcon name="active" />
      </SelectedContainer>
    );
  }

  if (!name && !surname) {
    return (
      <EmptyContainer mini={mini}>
        <StyledIcon name="user" />
      </EmptyContainer>
    );
  }

  const initials = `${name[0]?.toUpperCase()}${surname[0]?.toUpperCase()}`;

  return (
    <Container mini={mini} active={active} className={className}>
      <InnerContainer mini={mini}>{initials}</InnerContainer>
    </Container>
  );
};

const SelectedContainer = styled.div<{ mini?: boolean }>`
  border-radius: 50%;
  height: ${({ mini }) => (mini ? '24px' : '32px')};
  width: ${({ mini }) => (mini ? '24px' : '32px')};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: green;
  color: #ffffff;
`;

const EmptyContainer = styled.div<{ active?: boolean; mini?: boolean }>`
  border-radius: 50%;
  height: ${({ mini }) => (mini ? '24px' : '32px')};
  width: ${({ mini }) => (mini ? '24px' : '32px')};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px #707070 dashed;
  color: #707070;
`;

const Container = styled.div<{ active?: boolean; mini?: boolean }>`
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.secondary};
  height: ${({ mini }) => (mini ? '24px' : '32px')};
  width: ${({ mini }) => (mini ? '24px' : '32px')};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerContainer = styled.div<{
  mini?: boolean;
}>`
  font-size: ${({ mini }) => (mini ? '1rem' : '1.4rem')};
  letter-spacing: 0.84px;
  color: ${({ theme }) => theme.colors.primary};
  height: ${({ mini }) => (mini ? '24px' : '32px')};
  width: ${({ mini }) => (mini ? '24px' : '32px')};
  line-height: ${({ mini }) => (mini ? '24px' : '32px')};
  text-align: center;
  vertical-align: middle;
`;

const StyledIcon = styled(Icon)``;

export default Avatar;
