import { omit } from 'lodash';
import styled from 'styled-components';
import { FormRow } from '../../styles/CommonStyles';
import { Source } from '../../types';
import { buttonsTitles, formLabels, inputLabels } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import DateField from '../fields/DateField';
import TextField from '../fields/TextField';
import { FormItem } from '../other/FormItem';
import SimpleContainer from '../other/SimpleContainer';

const OrganizationsContainer = ({
  organizations,
  errors,
  handleChange,
  counter,
  setCounter,
  disabled,
}) => {
  const organizationKeys = Object.keys(organizations);
  return (
    <SimpleContainer title={formLabels.sportOrganizations}>
      <FormRow columns={1}>
        {organizationKeys.map((key) => {
          const item = organizations[key];
          return (
            <FormItem
              {...((organizationKeys.length > 1 || !disabled) && {
                onDelete: () => handleChange('organizations', omit(organizations, key)),
              })}
            >
              <FormRow>
                <TextField
                  disabled={disabled}
                  label={inputLabels.name}
                  value={item?.name}
                  error={errors?.name}
                  name="name"
                  onChange={(source: Source) => {
                    handleChange(`organizations.${key}.name`, source);
                  }}
                />

                <DateField
                  disabled={disabled}
                  name={'startAt'}
                  label={inputLabels.startAt}
                  value={item?.startAt}
                  maxDate={item?.endAt}
                  error={errors?.startAt}
                  onChange={(startAt) => handleChange(`organizations.${key}.startAt`, startAt)}
                />
                <DateField
                  disabled={disabled}
                  name={'endAt'}
                  label={inputLabels.endAt}
                  value={item?.endAt}
                  minDate={item?.startAt}
                  error={errors?.endAt}
                  onChange={(endAt) => handleChange(`organizations.${key}.endAt`, endAt)}
                />
              </FormRow>
            </FormItem>
          );
        })}
        <StyledButton
          disabled={disabled}
          error={!!errors}
          onClick={() => {
            handleChange('organizations', {
              [counter]: {
                source: undefined,
                fundsAmount: '',
                appointedAt: '',
              },
              ...organizations,
            });
            setCounter(counter + 1);
          }}
          variant={ButtonColors.TRANSPARENT}
          borderType={'dashed'}
        >
          {buttonsTitles.addOrganization}
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

export default OrganizationsContainer;
