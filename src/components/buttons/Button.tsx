import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles';
import Loader from '../other/Loader';

export enum ButtonColors {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  DANGER = 'danger',
  SUCCESS = 'success',
  TRANSPARENT = 'transparent',
  BACK = 'back',
  ALL = 'all',
}

const buttonColors = {
  [ButtonColors.PRIMARY]: theme.colors.primary,
  [ButtonColors.SECONDARY]: 'white',
  [ButtonColors.TERTIARY]: theme.colors.tertiary,
  [ButtonColors.DANGER]: theme.colors.error,
  [ButtonColors.SUCCESS]: theme.colors.success,
  [ButtonColors.TRANSPARENT]: theme.colors.transparent,
  [ButtonColors.BACK]: theme.colors.transparent,
  [ButtonColors.ALL]: theme.colors.transparent,
};

const buttonTextColors = {
  [ButtonColors.PRIMARY]: 'white',
  [ButtonColors.SECONDARY]: theme.colors.text.primary,
  [ButtonColors.TERTIARY]: 'white',
  [ButtonColors.DANGER]: 'white',
  [ButtonColors.SUCCESS]: 'white',
  [ButtonColors.TRANSPARENT]: theme.colors.text.primary,
  [ButtonColors.BACK]: theme.colors.text.active,
  [ButtonColors.ALL]: theme.colors.text.primary,
};

const buttonBorderColor = {
  [ButtonColors.BACK]: theme.colors.primary,
  [ButtonColors.ALL]: theme.colors.border,
};

export interface ButtonProps {
  variant?: ButtonColors;
  route?: string;
  children?: JSX.Element | string;
  leftIcon?: JSX.Element | string;
  rightIcon?: JSX.Element | string;
  height?: number;
  type?: string;
  loading?: boolean;
  padding?: string;
  buttonPadding?: string;
  signature?: boolean;
  disabled?: boolean;
  color?: string;
  fontWeight?: string;
  radius?: string;
}

const Button = ({
  variant = ButtonColors.PRIMARY,
  route,
  children,
  height = 40,
  padding = '11px 20px',
  leftIcon,
  radius = '4px',
  buttonPadding,
  rightIcon,
  color,
  type,
  loading = false,
  className,
  disabled = false,
  fontWeight = '500',
  ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <StyledButton
      className={className}
      padding={padding}
      fontWeight={fontWeight}
      variant={variant}
      height={height || 40}
      type={type}
      disabled={disabled}
      $radius={radius}
      {...rest}
    >
      {leftIcon && <IconContainer>{leftIcon}</IconContainer>}
      {loading ? <Loader color="white" /> : children}
      {rightIcon && <IconContainer>{rightIcon}</IconContainer>}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  variant: ButtonColors;
  height: number;
  padding?: string;
  fontWeight?: string;
  $radius?: string;
}>`
  display: flex;
  justify-content: center;
  gap: 12px;
  align-items: center;
  height: ${({ height }) => `${height}px`};
  border-radius: ${({ $radius }) => $radius};
  padding: ${({ padding }) => padding};
  background-color: ${({ variant }) => buttonColors[variant]};
  color: ${({ variant }) => buttonTextColors[variant]};
  border: 1px solid
    ${({ variant }) =>
      variant !== ButtonColors.TRANSPARENT
        ? buttonBorderColor[variant] || 'transparent'
        : ' rgb(35, 31, 32)'};
  font-weight: ${({ fontWeight }) => fontWeight};
  font-size: 1.6rem;
  :hover {
    background-color: ${({ variant, theme }) => theme.colors.hover[variant]};
  }
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  white-space: nowrap;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Button;
