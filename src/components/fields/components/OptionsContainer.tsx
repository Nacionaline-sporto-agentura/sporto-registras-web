import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { inputLabels } from '../../../utils/texts';
import FullscreenLoader from '../../other/FullscreenLoader';

export interface SelectOption {
  id?: string;
  label?: string;
  [key: string]: any;
}

export interface OptionsContainerProps {
  values?: any[];
  disabled?: boolean;
  getOptionLabel: (option: any) => string;
  getOptionDescription?: (option: any) => string;
  loading?: boolean;
  showSelect: boolean;
  observerRef?: any;
  handleClick: (option: any) => any;
  className?: string;
}

const OptionsContainer = ({
  values = [],
  disabled = false,
  getOptionLabel,
  getOptionDescription,
  handleClick,
  showSelect,
  loading,
  observerRef,
  className,
}: OptionsContainerProps) => {
  const display = showSelect && !disabled;

  const renderOptions = () => {
    if (isEmpty(values))
      return loading ? (
        <FullscreenLoader />
      ) : (
        <Option key={inputLabels.noOptions}>{inputLabels.noOptions}</Option>
      );

    return (
      <>
        {values.map((option) => {
          return (
            <OptionWrapper
              key={JSON.stringify(option)}
              onClick={() => {
                handleClick(option);
              }}
            >
              <Option>{getOptionLabel && getOptionLabel(option)}</Option>
              {getOptionDescription && (
                <OptionDescription>{getOptionDescription(option)}</OptionDescription>
              )}
            </OptionWrapper>
          );
        })}
        {loading && <FullscreenLoader />}
      </>
    );
  };
  return (
    <OptionContainer className={className} $display={display}>
      {renderOptions()}
      {observerRef && <ObserverRef $display={display} ref={observerRef} />}
    </OptionContainer>
  );
};

const OptionContainer = styled.div<{ $display: boolean }>`
  display: ${({ $display }) => ($display ? 'block' : 'none')};
  position: absolute;
  z-index: 9;
  width: 100%;
  padding: 10px 0px;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  border: none;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 2px 16px #121a5529;

  > * {
    &:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
  }
  > * {
    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
`;

const OptionWrapper = styled.div`
  cursor: pointer;
  line-height: 20px;
  padding: 8px 12px;
  &:hover {
    background: #f3f3f7 0% 0% no-repeat padding-box;
  }
`;

const Option = styled.div`
  font-size: 1.6rem;
`;
const OptionDescription = styled.div`
  font-size: 1.25rem;
  color: #3f3f3f;
`;

const ObserverRef = styled.div<{ $display: boolean }>`
  display: ${({ $display }) => ($display ? 'block' : 'none')};
`;

export default OptionsContainer;
