import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow } from '../../styles/CommonStyles';
import { Source } from '../../types';
import {
  buttonsTitles,
  descriptions,
  formLabels,
  inputLabels,
  legalFormLabels,
  pageTitles,
  validationTexts,
} from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import TextField from '../fields/TextField';
import UrlField from '../fields/UrlField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import InnerContainerRow from '../other/InnerContainerRow';
import MainTable from '../tables/MainTable';
import ButtonsGroup from '../buttons/ButtonsGroup';
import { LegalForms } from '../../utils/constants';
import { companyCode, personalCode } from 'lt-codes';

const ownersSchema = Yup.object().shape({
  legalForm: Yup.mixed().oneOf(Object.values(LegalForms)),
  name: Yup.string().required(validationTexts.requireText),
  code: Yup.string()
    .required(validationTexts.requireText)
    .when(['legalForm'], (items: any[], schema) => {
      const legalForm = items[0];
      const validation = legalForm === LegalForms.COMPANY ? companyCode : personalCode;
      const validationText =
        legalForm === LegalForms.COMPANY
          ? validationTexts.companyCode
          : validationTexts.personalCode;

      return schema.trim().test('validateCode', validationText, (value) => {
        return validation.validate(value).isValid;
      });
    }),
  website: Yup.string(),
});

const ownersLabels = {
  name: {
    label: inputLabels.owner,
    show: true,
  },
  code: {
    label: inputLabels.code,
    show: true,
  },
  website: { label: inputLabels.website, show: true },
};

const getInitialValues = (owner: any = {}) => {
  if (!owner?.legalForm) {
    return { ...owner, legalForm: LegalForms.COMPANY };
  }
  return owner;
};

const OwnersContainer = ({ owners = {}, handleChange, disabled }) => {
  const ownerKeys = Object.keys(owners);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<any>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedOwners = { ...owners, [index]: rest };

      handleChange('owners', updatedOwners);
    } else {
      handleChange('owners', { [generateUniqueString()]: values, ...owners });
    }

    setCurrent(undefined);
  };

  const initialValues = getInitialValues(current);

  return (
    <>
      <InnerContainerRow
        title={pageTitles.owners}
        description={descriptions.owners}
        buttonTitle={buttonsTitles.addOwner}
        disabled={disabled}
        onCreateNew={() => setCurrent({})}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų savininkų' }}
        isFilterApplied={false}
        data={{
          data: ownerKeys.map((key) => ({
            ...owners[key],
            id: key,
          })),
        }}
        hidePagination={true}
        columns={ownersLabels}
        onClick={(id) => {
          setCurrent({ ...owners[id], index: id });
        }}
      />

      <Popup title={formLabels.addOwner} visible={!!current} onClose={() => setCurrent(undefined)}>
        <Formik
          validateOnChange={validateOnChange}
          enableReinitialize={false}
          initialValues={initialValues}
          validate={() => {
            setValidateOnChange(true);
          }}
          onSubmit={onSubmit}
          validationSchema={ownersSchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <ButtonsGroup
                    options={Object.values(LegalForms)}
                    onChange={(value) => setFieldValue('legalForm', value)}
                    isSelected={(option) => option === (values.legalForm || LegalForms.COMPANY)}
                    getOptionLabel={(option) => legalFormLabels[option]}
                    label={inputLabels.ownerType}
                  />
                  <TextField
                    disabled={disabled}
                    label={
                      values.legalForm === LegalForms.COMPANY
                        ? inputLabels.jarName
                        : inputLabels.fullName
                    }
                    value={values?.name}
                    error={errors?.name}
                    name="name"
                    onChange={(source: Source) => {
                      setFieldValue(`name`, source);
                    }}
                  />
                  <TextField
                    disabled={disabled}
                    label={
                      values.legalForm === LegalForms.COMPANY
                        ? inputLabels.jarCode
                        : inputLabels.personalCode
                    }
                    value={values?.code}
                    error={errors?.code}
                    name="code"
                    onChange={(code: string) => {
                      setFieldValue(`code`, code);
                    }}
                  />
                  <UrlField
                    disabled={disabled}
                    label={inputLabels.website}
                    value={values?.website}
                    error={errors?.website}
                    onChange={(endAt) => setFieldValue(`website`, endAt)}
                  />
                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('owners', omit(owners, values.index));
                            setCurrent(undefined);
                          }}
                        >
                          {buttonsTitles.delete}
                        </Button>
                      )}
                      <Button type="submit">{buttonsTitles.save}</Button>
                    </ButtonRow>
                  )}
                </FormRow>
              </Form>
            );
          }}
        </Formik>
      </Popup>
    </>
  );
};

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 16px 0;
`;

export default OwnersContainer;
