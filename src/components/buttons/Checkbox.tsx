import styled from 'styled-components';

export interface CheckBoxProps {
  value?: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  className?: string;
  someChildrenSelected?: boolean;
}

const Checkbox = ({
  value,
  onChange,
  disabled = false,
  label,
  error,
  className,
  someChildrenSelected,
}: CheckBoxProps) => {
  return (
    <>
      <Container
        className={className}
        disabled={disabled}
        onClick={() => {
          !disabled && onChange(!value);
        }}
      >
        <InnerContainer
          someChildrenSelected={someChildrenSelected}
          disabled={disabled}
          error={error}
          checked={value}
        >
          <CheckBoxInput
            aria-label={label}
            type="checkbox"
            checked={value || false}
            disabled={disabled}
            readOnly
          />
          <Label htmlFor={label} disabled={disabled} />
        </InnerContainer>
        <TextLabel>{label}</TextLabel>
      </Container>
    </>
  );
};

const Container = styled.div<{ disabled: boolean }>`
  display: grid;
  grid-template-columns: 28px 1fr;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const TextLabel = styled.div`
  text-align: left;
  font-size: 1.4rem;
  color: #4b5565;
`;

const InnerContainer = styled.div<{
  checked?: boolean;
  error?: boolean;
  disabled?: boolean;
  someChildrenSelected?: boolean;
}>`
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 2px;
  background-color: ${({ theme, checked, error, someChildrenSelected }) =>
    checked || someChildrenSelected
      ? theme.colors.primary
      : error
      ? theme.colors.error
      : theme.colors.border};
  margin-right: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
`;

const Label = styled.label<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  position: absolute;
  width: 14px;
  height: 14px;
  left: 2px;
  top: 2px;

  background-color: white;

  &::after {
    -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)';
    filter: alpha(opacity=0);
    opacity: 0;
    content: '';
    position: absolute;
    width: 11px;
    height: 4px;
    top: 3px;
    left: 1px;
    background: transparent;
    border-bottom: 2px solid #fcfff4;
    border-left: 2px solid #fcfff4;
    border-top: none;
    border-right: none;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
`;
const CheckBoxInput = styled.input<{ disabled: boolean }>`
  position: absolute;
  width: 20px;
  height: 20px;
  top: -4px;
  left: -4px;
  opacity: 0;

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  &:checked + label {
    background-color: transparent;
  }
  &:checked + label::after {
    -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=100)';
    filter: alpha(opacity=100);
    opacity: 1;
  }
`;
export default Checkbox;
