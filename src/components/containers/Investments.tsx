import { format } from 'date-fns';
import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { sportBaseTabTitles } from '../../pages/SportBase';
import { FormRow, TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { Source, SportBase } from '../../types';
import { getSourcesList } from '../../utils/functions';
import { buttonsTitles, formLabels, inputLabels, validationTexts } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import AsyncSelectField from '../fields/AsyncSelectField';
import DateField from '../fields/DateField';
import NumericTextField from '../fields/NumericTextField';
import Popup from '../layouts/Popup';
import MainTable from '../tables/MainTable';

const investmentsSchema = Yup.object().shape({
  source: Yup.object().required(validationTexts.requireText),
  fundsAmount: Yup.string().required(validationTexts.requireText),
  appointedAt: Yup.date().required(validationTexts.requireText),
});

const investmentsLabels = {
  source: { label: inputLabels.source, show: true },
  fundsAmount: { label: inputLabels.fundsAmount, show: true },
  appointedAt: { label: inputLabels.appointedAt, show: true },
};

const InvestmentsContainer = ({ investments, handleChange, counter, setCounter, disabled }) => {
  const investmentKeys = Object.keys(investments);

  const [current, setCurrent] = useState<SportBase['investments'] | {}>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedOrganizations = { ...investments, [index]: rest };

      handleChange('investments', updatedOrganizations);
    } else {
      handleChange('investments', { [counter]: values, ...investments });
      setCounter(setCounter + 1);
    }

    setCurrent(undefined);
  };

  const initialValues: any = current || {};

  return (
    <>
      <TableButtonsRow>
        <TableButtonsInnerRow>
          <Title>{sportBaseTabTitles.investments}</Title>
        </TableButtonsInnerRow>
        <Button disabled={disabled} onClick={() => setCurrent({})}>
          {buttonsTitles.addOrganization}
        </Button>
      </TableButtonsRow>
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų investicijų' }}
        isFilterApplied={false}
        data={{
          data: investmentKeys.map((key) => ({
            ...investments[key],
            source: investments?.[key]?.source?.name,
            appointedAt: format(new Date(investments?.[key]?.appointedAt), 'yyyy-MM-dd'),
            id: key,
          })),
        }}
        hidePagination={true}
        columns={investmentsLabels}
        onClick={(id) => {
          setCurrent({ ...investments[id], index: id });
        }}
      />

      <Popup
        title={formLabels.sportOrganizations}
        visible={!!current}
        onClose={() => setCurrent(undefined)}
      >
        <Formik
          validateOnChange={false}
          enableReinitialize={false}
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={investmentsSchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.source}
                    value={values?.source}
                    error={errors?.source}
                    name="source"
                    onChange={(source: Source) => {
                      setFieldValue(`source`, source);
                    }}
                    getOptionLabel={(option) => option?.name}
                    loadOptions={(input, page) => getSourcesList(input, page)}
                  />
                  <NumericTextField
                    disabled={disabled}
                    label={inputLabels.fundsAmount}
                    value={values?.fundsAmount}
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
                  <ButtonRow>
                    {values.index && (
                      <Button
                        disabled={disabled}
                        variant={ButtonColors.DANGER}
                        onClick={() => {
                          handleChange('investments', omit(investments, values.index));
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

const Title = styled.div`
  font-size: 2rem;
  line-height: 25px;
  font-weight: bold;
  color: #231f20;
  margin-right: 16px;
`;

export default InvestmentsContainer;
