import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { AthleteMembership } from '../../types';
import { formatDate } from '../../utils/functions';
import {
  buttonsTitles,
  descriptions,
  formLabels,
  inputLabels,
  pageTitles,
  validationTexts,
} from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import DateField from '../fields/DateField';
import NumericTextField from '../fields/NumericTextField';
import TextField from '../fields/TextField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import MainTable from '../tables/MainTable';

interface AthleteMembershipForm extends AthleteMembership {
  index: string;
}

const membershipSchema = Yup.object().shape({
  documentNumber: Yup.string().required(validationTexts.requireText),

  date: Yup.date().required(validationTexts.requireText),
  series: Yup.string().required(validationTexts.requireText),
});

const membershipTableLabels = {
  documentNumber: { label: inputLabels.documentNo, show: true },
  date: { label: inputLabels.issued, show: true },
  series: { label: inputLabels.series, show: true },
};

const AthleteMembershipContainer = ({
  memberships = {},
  handleChange,
  disabled,
}: {
  memberships: { [key: string]: AthleteMembership };
  handleChange: any;
  disabled: boolean;
}) => {
  const membershipsKeys = Object.keys(memberships);
  const [validateOnChange, setValidateOnChange] = useState(false);

  const [current, setCurrent] = useState<AthleteMembershipForm>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedGoverningBodies = { ...memberships, [index]: rest };

      handleChange('athlete.memberships', updatedGoverningBodies);
    } else {
      handleChange('athlete.memberships', { [generateUniqueString()]: values, ...memberships });
    }
    setValidateOnChange(false);
    setCurrent(undefined);
  };

  const initialValues = current!;

  const mappedData = {
    data: membershipsKeys.map((key) => {
      const membership = memberships?.[key];

      return {
        ...membership,
        date: formatDate(membership?.date),
        id: key,
      };
    }),
  };

  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.memberships}
        description={descriptions.membershipInfo}
        buttonTitle={buttonsTitles.addMembership}
        disabled={disabled}
        onCreateNew={() => setCurrent({} as any)}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų narysčių' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={membershipTableLabels}
        onClick={(id) => {
          setCurrent({ ...memberships[id], index: id });
        }}
      />
      <Popup
        title={formLabels.addMembership}
        visible={!!current}
        onClose={() => setCurrent(undefined)}
      >
        <Formik
          validateOnChange={validateOnChange}
          enableReinitialize={false}
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={() => {
            setValidateOnChange(true);
          }}
          validationSchema={membershipSchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <NumericTextField
                    disabled={disabled}
                    label={inputLabels.documentNo}
                    error={errors?.documentNumber}
                    value={values.documentNumber}
                    name="documentNumber"
                    onChange={(input) => setFieldValue(`documentNumber`, input)}
                  />

                  <FormRow columns={2}>
                    <TextField
                      disabled={disabled}
                      label={inputLabels.series}
                      error={errors?.series}
                      value={values.series}
                      name="series"
                      onChange={(input) => setFieldValue(`series`, input)}
                    />
                    <DateField
                      disabled={disabled}
                      name={'issued'}
                      label={inputLabels.issued}
                      value={values?.date}
                      error={errors?.date}
                      onChange={(date) => setFieldValue(`date`, date)}
                    />
                  </FormRow>

                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          disabled={disabled}
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('athlete.memberships', omit(memberships, values.index));
                            setCurrent(undefined);
                          }}
                        >
                          {buttonsTitles.delete}
                        </Button>
                      )}
                      <Button disabled={disabled} type="submit">
                        {buttonsTitles.save}
                      </Button>
                    </ButtonRow>
                  )}
                </FormRow>
              </Form>
            );
          }}
        </Formik>
      </Popup>
    </Container>
  );
};

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 16px 0;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export default AthleteMembershipContainer;
