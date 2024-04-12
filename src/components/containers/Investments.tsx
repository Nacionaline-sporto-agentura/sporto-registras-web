import { omit } from 'lodash';
import styled from 'styled-components';
import { FormRow } from '../../styles/CommonStyles';
import { Source } from '../../types';
import { getSourcesList } from '../../utils/functions';
import { buttonsTitles, formLabels, inputLabels } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import AsyncSelectField from '../fields/AsyncSelectField';
import DateField from '../fields/DateField';
import NumericTextField from '../fields/NumericTextField';
import { FormItem } from '../other/FormItem';
import SimpleContainer from '../other/SimpleContainer';

const InvestmentsContainer = ({
  investments,
  errors,
  handleChange,
  counter,
  setCounter,
  disabled,
}) => {
  const investmentKeys = Object.keys(investments);

  return (
    <SimpleContainer title={formLabels.investments}>
      <FormRow columns={1}>
        {investmentKeys.map((key) => {
          const item = investments[key];
          return (
            <FormItem
              {...((!disabled || investmentKeys.length > 1) && {
                onDelete: () => handleChange('investments', omit(investments, key)),
              })}
            >
              <FormRow>
                <AsyncSelectField
                  disabled={disabled}
                  label={inputLabels.source}
                  value={item?.source}
                  error={errors?.source}
                  name="source"
                  onChange={(source: Source) => {
                    handleChange(`investments.${key}.source`, source);
                  }}
                  getOptionLabel={(option) => option?.name}
                  loadOptions={(input, page) => getSourcesList(input, page)}
                />
                <NumericTextField
                  disabled={disabled}
                  label={inputLabels.fundsAmount}
                  value={item?.fundsAmount}
                  error={errors?.fundsAmount}
                  name={`investments.${key}.fundsAmount`}
                  onChange={(e: string) => {
                    handleChange(`investments.${key}.fundsAmount`, e);
                  }}
                />
                <DateField
                  disabled={disabled}
                  label={inputLabels.appointedAt}
                  value={item?.appointedAt}
                  error={errors?.appointedAt}
                  onChange={(appointedAt) =>
                    handleChange(`investments.${key}.appointedAt`, appointedAt)
                  }
                />
              </FormRow>
            </FormItem>
          );
        })}
        <StyledButton
          disabled={disabled}
          error={!!errors}
          onClick={() => {
            handleChange('investments', {
              [counter]: {
                source: undefined,
                fundsAmount: '',
                appointedAt: '',
              },
              ...investments,
            });
            setCounter(counter + 1);
          }}
          variant={ButtonColors.TRANSPARENT}
          borderType={'dashed'}
        >
          {buttonsTitles.addInvestment}
        </StyledButton>
      </FormRow>
    </SimpleContainer>
  );
};

const StyledButton = styled(Button)<{
  error: boolean;
}>`
  border-color: ${({ error }) => (error ? 'red' : '#CDD5DF')};
`;

export default InvestmentsContainer;
