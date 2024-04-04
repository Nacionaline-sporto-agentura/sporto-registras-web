import { omit } from 'lodash';
import styled from 'styled-components';
import { FormRow } from '../../styles/CommonStyles';
import { Source } from '../../types';
import { buttonsTitles, formLabels, inputLabels } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import TextField from '../fields/TextField';
import UrlField from '../fields/UrlField';
import { FormItem } from '../other/FormItem';
import SimpleContainer from '../other/SimpleContainer';

const OwnersContainer = ({ owners, errors, handleChange, counter, setCounter, disabled }) => {
  const ownerKeys = Object.keys(owners);

  return (
    <SimpleContainer title={formLabels.infoAboutOwner}>
      <FormRow columns={1}>
        {ownerKeys.map((key) => {
          const item = owners[key];
          return (
            <FormItem
              {...((!disabled || ownerKeys.length > 1) && {
                onDelete: () => handleChange('owners', omit(owners, key)),
              })}
            >
              <FormRow>
                <TextField
                  disabled={disabled}
                  label={inputLabels.jarName}
                  value={item?.name}
                  error={errors?.name}
                  name="name"
                  onChange={(source: Source) => {
                    handleChange(`owners.${key}.name`, source);
                  }}
                />
                <TextField
                  disabled={disabled}
                  label={inputLabels.code}
                  value={item?.code}
                  error={errors?.code}
                  name="code"
                  onChange={(source: Source) => {
                    handleChange(`owners.${key}.code`, source);
                  }}
                />
                <UrlField
                  disabled={disabled}
                  label={inputLabels.website}
                  value={item?.website}
                  error={errors?.website}
                  onChange={(endAt) => handleChange(`owners.${key}.website`, endAt)}
                />
              </FormRow>
            </FormItem>
          );
        })}
        <StyledButton
          error={!!errors}
          onClick={() => {
            handleChange('owners', {
              [counter]: {
                source: undefined,
                fundsAmount: '',
                appointedAt: '',
              },
              ...owners,
            });
            setCounter(counter + 1);
          }}
          variant={ButtonColors.TRANSPARENT}
          borderType={'dashed'}
          disabled={disabled}
        >
          {buttonsTitles.addOwner}
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

export default OwnersContainer;
