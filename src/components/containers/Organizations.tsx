import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { sportBaseTabTitles } from '../../pages/SportBase';
import { FormRow, TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { Source, SportBase } from '../../types';
import { buttonsTitles, formLabels, inputLabels, validationTexts } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import DateField from '../fields/DateField';
import TextField from '../fields/TextField';
import Popup from '../layouts/Popup';
import MainTable from '../tables/MainTable';

const organizationsSchema = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
  endAt: Yup.date().required(validationTexts.requireText),
  startAt: Yup.date().required(validationTexts.requireText),
});

const organizationsLabels = {
  name: { label: inputLabels.name, show: true },
  endAt: { label: inputLabels.endAt, show: true },
  startAt: { label: inputLabels.startAt, show: true },
};

const OrganizationsContainer = ({ organizations, handleChange, counter, setCounter, disabled }) => {
  const organizationKeys = Object.keys(organizations);

  const [current, setCurrent] = useState<SportBase['organizations'] | {}>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedOrganizations = { ...organizations, [index]: rest };

      handleChange('organizations', updatedOrganizations);
    } else {
      handleChange('organizations', { [counter]: values, ...organizations });
      setCounter(setCounter + 1);
    }

    setCurrent(undefined);
  };

  const initialValues: any = current || {};

  return (
    <>
      <TableButtonsRow>
        <TableButtonsInnerRow>
          <Title>{sportBaseTabTitles.organizations}</Title>
        </TableButtonsInnerRow>
        {!disabled && (
          <Button disabled={disabled} onClick={() => setCurrent({})}>
            {buttonsTitles.addOrganization}
          </Button>
        )}
      </TableButtonsRow>
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų organizacijų' }}
        isFilterApplied={false}
        data={{ data: organizationKeys.map((key) => ({ ...organizations[key], id: key })) }}
        hidePagination={true}
        columns={organizationsLabels}
        onClick={(id) => {
          setCurrent({ ...organizations[id], index: id });
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
          validationSchema={organizationsSchema}
        >
          {({ values, errors, setFieldValue }) => {
            console.log(errors, 'errors');
            return (
              <Form>
                <FormRow columns={1}>
                  <TextField
                    disabled={disabled}
                    label={inputLabels.name}
                    value={values?.name}
                    error={errors?.name}
                    name="name"
                    onChange={(source: Source) => {
                      setFieldValue(`name`, source);
                    }}
                  />

                  <DateField
                    disabled={disabled}
                    name={'startAt'}
                    label={inputLabels.startAt}
                    value={values?.startAt}
                    maxDate={values?.endAt}
                    error={errors?.startAt}
                    onChange={(startAt) => setFieldValue(`startAt`, startAt)}
                  />
                  <DateField
                    disabled={disabled}
                    name={'endAt'}
                    label={inputLabels.endAt}
                    value={values?.endAt}
                    minDate={values?.startAt}
                    error={errors?.endAt}
                    onChange={(endAt) => setFieldValue(`endAt`, endAt)}
                  />
                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('organizations', omit(organizations, values.index));
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

const Title = styled.div`
  font-size: 2rem;
  line-height: 25px;
  font-weight: bold;
  color: #231f20;
  margin-right: 16px;
`;

export default OrganizationsContainer;
