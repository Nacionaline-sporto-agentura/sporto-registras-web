import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { WorkRelation } from '../../types';
import { formatDate, getOrganizationsList, getWorkRelationsList } from '../../utils/functions';
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
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import MainTable from '../tables/MainTable';
import TableItem from '../tables/TableItem';

const workRelationSchema = Yup.object().shape({
  organization: Yup.object().required(validationTexts.requireSelect),
  basis: Yup.object().required(validationTexts.requireSelect),
  startAt: Yup.date().required(validationTexts.requireText),
  endAt: Yup.date().required(validationTexts.requireText),
});

const workRelationLabels = {
  organization: { label: inputLabels.sportsOrganization, show: true },
  basis: { label: inputLabels.basis, show: true },
  startAt: { label: inputLabels.startAt, show: true },
  endAt: { label: inputLabels.endAt, show: true },
};

const WorkRelationsContainer = ({ workRelations = {}, handleChange, disabled }) => {
  const workRelationKeys = Object.keys(workRelations);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<WorkRelation>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedWorkRelations = { ...workRelations, [index]: rest };

      handleChange('workRelations', updatedWorkRelations);
    } else {
      handleChange('workRelations', { [generateUniqueString()]: values, ...workRelations });
    }

    setCurrent(undefined);
  };

  const initialValues = current;

  const mappedData = {
    data: workRelationKeys.map((key) => {
      const workRelation = workRelations?.[key];

      return {
        ...workRelation,
        organization: (
          <TableItem
            label={workRelation?.organization?.name}
            bottomLabel={workRelation?.organization?.code}
          />
        ),
        basis: workRelation?.basis?.name,
        startAt: formatDate(workRelation?.startAt),
        endAt: formatDate(workRelation?.endAt),
        id: key,
      };
    }),
  };

  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.workRelations}
        description={descriptions.workRelations}
        buttonTitle={buttonsTitles.addWorkRelations}
        disabled={disabled}
        onCreateNew={() => setCurrent({} as any)}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų darbo santykių' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={workRelationLabels}
        onClick={(id) => {
          setCurrent({ ...workRelations[id], index: id } as any);
        }}
      />

      <Popup
        title={formLabels.addWorkRelations}
        visible={!!current}
        onClose={() => setCurrent(undefined)}
      >
        <Formik
          validateOnChange={validateOnChange}
          enableReinitialize={false}
          initialValues={initialValues!}
          validate={() => {
            setValidateOnChange(true);
          }}
          onSubmit={onSubmit}
          validationSchema={workRelationSchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.sportsOrganization}
                    value={values?.organization}
                    error={errors?.organization}
                    name="organization"
                    onChange={(basis) => {
                      setFieldValue(`organization`, basis);
                    }}
                    getOptionLabel={(option) => option?.name || '-'}
                    loadOptions={(input, page) => getOrganizationsList(input, page)}
                  />

                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.activityBasis}
                    value={values?.basis}
                    error={errors?.basis}
                    name="basis"
                    onChange={(basis) => {
                      setFieldValue(`basis`, basis);
                    }}
                    getOptionLabel={(option) => option?.name}
                    loadOptions={(input, page) => getWorkRelationsList(input, page)}
                  />
                </FormRow>
                <FormRow columns={2}>
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
                </FormRow>
                <FormRow columns={1}>
                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('workRelations', omit(workRelations, values.index));
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

export default WorkRelationsContainer;
