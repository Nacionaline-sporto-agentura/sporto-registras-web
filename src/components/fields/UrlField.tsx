import styled from 'styled-components';
import FieldWrapper from './components/FieldWrapper';
import TextFieldInput from './components/TextFieldInput';

export interface UrlFieldProps {
  value?: string | number;
  name?: string;
  error?: any;
  showError?: boolean;
  label?: string;
  icon?: JSX.Element;
  className?: string;
  padding?: string;
  onChange: (option: any) => void;
  bottomLabel?: string;
  disabled?: boolean;
  height?: number;
  placeholder?: string;
  secondLabel?: JSX.Element;
  subLabel?: string;
}

const UrlField = ({
  value,
  name,
  error,
  label,
  className,
  padding,
  onChange,
  placeholder,
  disabled,
  height,
  showError,
  bottomLabel,
}: UrlFieldProps) => {
  return (
    <FieldWrapper
      padding={padding}
      className={className}
      bottomLabel={bottomLabel}
      label={label}
      error={error}
      showError={showError}
    >
      <TextFieldInput
        value={value}
        name={name}
        error={error}
        leftIcon={<Icon error={!!error}>https://</Icon>}
        onChange={onChange}
        disabled={disabled}
        height={height}
        placeholder={placeholder}
      />
    </FieldWrapper>
  );
};

export const Icon = styled.div<{ error: boolean }>`
  border-right: 1px solid
    ${({ theme, error }) => (error ? theme.colors.error : theme.colors.border)};
  padding: 12px;
  color: #9aa4b2;
`;

export default UrlField;
