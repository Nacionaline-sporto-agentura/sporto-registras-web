import styled from 'styled-components';
import Icon, { IconName } from '../other/Icons';
import FieldWrapper from './components/FieldWrapper';
import OptionsContainer from './components/OptionsContainer';
import TextFieldInput from './components/TextFieldInput';
import { useAsyncSelectData } from './utils/hooks';

export interface AsyncSelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value?: any;
  error?: any;
  showError?: boolean;
  editable?: boolean;
  left?: JSX.Element;
  handleLogs?: (data: any) => void;
  right?: JSX.Element;
  padding?: string;
  onChange: (option: any) => void;
  disabled?: boolean;
  getOptionLabel: (option: any) => string;
  getInputLabel?: (option: any) => string;
  className?: string;
  placeholder?: string;
  backgroundColor?: string;
  hasBorder?: boolean;
  loadOptions: (input: any, page: string, value?: any) => any;
  dependsOnTheValue?: any;
  optionsKey?: string;
}

const AsyncSelectField = ({
  label,
  value,
  name,
  error,
  hasBorder,
  showError = true,
  editable = true,
  className,
  left,
  right,
  padding,
  onChange,
  handleLogs,
  disabled = false,
  backgroundColor,
  getOptionLabel,
  optionsKey = 'rows',
  loadOptions,
  dependsOnTheValue,
  ...rest
}: AsyncSelectFieldProps) => {
  const {
    loading,
    observerRef,
    suggestions,
    handleInputChange,
    handleToggleSelect,
    input,
    showSelect,
    handleBlur,
    handleClick,
  } = useAsyncSelectData({
    loadOptions,
    name,
    dependsOnTheValue,
    optionsKey,
    disabled,
    onChange,
  });

  return (
    <FieldWrapper
      onClick={handleToggleSelect}
      handleBlur={handleBlur}
      padding={padding}
      className={className}
      label={label}
      error={error}
      showError={showError}
    >
      <TextFieldInput
        value={input}
        name={name}
        error={error}
        leftIcon={left}
        rightIcon={
          <>
            {value && !disabled && (
              <IconContainer
                $disabled={!!disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  !disabled && onChange(undefined);
                }}
              >
                <ClearIcon $disabled={disabled!} name={IconName.close} />
              </IconContainer>
            )}
            <StyledIcon name={IconName.dropdownArrow} />
          </>
        }
        onChange={handleInputChange}
        disabled={disabled}
        placeholder={(value && getOptionLabel(value)) || 'Pasirinkite'}
        selectedValue={value}
      />

      <OptionsContainer
        loading={loading}
        observerRef={observerRef}
        values={suggestions}
        getOptionLabel={getOptionLabel}
        showSelect={showSelect}
        handleClick={handleClick}
      />
    </FieldWrapper>
  );
};

const ClearIcon = styled(Icon)<{ $disabled: boolean }>`
  color: #cdd5df;
  font-size: 2.4rem;
  margin-right: 12px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const IconContainer = styled.div<{ $disabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const StyledIcon = styled(Icon)`
  color: #cdd5df;
  font-size: 2.4rem;
  margin-right: 12px;
`;

export default AsyncSelectField;
