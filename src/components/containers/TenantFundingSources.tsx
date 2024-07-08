import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow } from '../../styles/CommonStyles';
import { Source, TenantFundingSource } from '../../types';
import { getTenantSourcesList } from '../../utils/functions';
import {
  buttonsTitles,
  descriptions,
  formLabels,
  inputLabels,
  pageTitles,
  validationTexts,
} from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import AsyncSelectField from '../fields/AsyncSelectField';
import DateField from '../fields/DateField';
import NumericTextField from '../fields/NumericTextField';
import TextAreaField from '../fields/TextAreaField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import InnerContainerRow from '../other/InnerContainerRow';
import MainTable from '../tables/MainTable';

interface TenantFundingSourceForm extends TenantFundingSource {
  index: number;
}

const fundingSourceSchema = Yup.object().shape({
  source: Yup.object().required(validationTexts.requireText),
  fundsAmount: Yup.string().required(validationTexts.requireText),
  description: Yup.string().required(validationTexts.requireText),
  appointedAt: Yup.date().required(validationTexts.requireText),
});

const fundingSourceLabels = {
  source: { label: inputLabels.fundingSource, show: true },
};

const TenantFundingSourcesContainer = ({
  fundingSources = {},
  handleChange,
  disabled,
}: {
  fundingSources: { [key: string]: TenantFundingSource };
  handleChange: any;
  disabled: boolean;
}) => {
  const fundingSourceKeys = Object.keys(fundingSources);
  const [validateOnChange, setValidateOnChange] = useState(false);

  const [current, setCurrent] = useState<TenantFundingSourceForm | {}>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedInvestments = { ...fundingSources, [index]: rest };

      handleChange('fundingSources', updatedInvestments);
    } else {
      handleChange('fundingSources', { [generateUniqueString()]: values, ...fundingSources });
    }
    setValidateOnChange(false);
    setCurrent(undefined);
  };

  const initialValues: any = current || {};

  const mappedData = {
    data: fundingSourceKeys.map((key) => ({
      source: fundingSources?.[key]?.source?.name,
      id: key,
    })),
  };

  return (
    <>
      <InnerContainerRow
        title={pageTitles.fundingSources}
        description={descriptions.fundingSources}
        buttonTitle={buttonsTitles.addFundingSource}
        disabled={disabled}
        onCreateNew={() => setCurrent({})}
      />

      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų finansavimo šaltinių' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={fundingSourceLabels}
        onClick={(id) => {
          setCurrent({ ...fundingSources[id], index: id });
        }}
      />

      <Popup
        title={formLabels.addGoverningBody}
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
          validationSchema={fundingSourceSchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.investmentSources}
                    value={values?.source}
                    showError={false}
                    error={errors?.source}
                    name="source"
                    onChange={(source: Source) => {
                      setFieldValue(`source`, source);
                    }}
                    getOptionLabel={(option) => option?.name}
                    loadOptions={(input, page) => getTenantSourcesList(input, page)}
                  />
                  <NumericTextField
                    disabled={disabled}
                    label={inputLabels.fundsAmount}
                    value={values?.fundsAmount}
                    showError={false}
                    error={errors?.fundsAmount}
                    onChange={(e: string) => {
                      setFieldValue(`fundsAmount`, e);
                    }}
                  />
                  <DateField
                    disabled={disabled}
                    label={inputLabels.appointedAt}
                    value={values?.appointedAt}
                    error={errors?.appointedAt}
                    onChange={(appointedAt) => setFieldValue(`appointedAt`, appointedAt)}
                  />

                  <TextAreaField
                    disabled={disabled}
                    label={inputLabels.description}
                    error={errors?.description}
                    value={values.description}
                    name="improvements"
                    onChange={(input) => setFieldValue(`improvements`, input)}
                  />

                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          disabled={disabled}
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('fundingSources', omit(fundingSources, values.index));
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
    </>
  );
};

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 16px 0;
`;

export default TenantFundingSourcesContainer;
