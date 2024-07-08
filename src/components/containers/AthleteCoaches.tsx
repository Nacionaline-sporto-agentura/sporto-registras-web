import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { AthleteCoach } from '../../types';
import { formatDate, getSportsPersonList } from '../../utils/functions';
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

interface AthleteMembershipForm extends AthleteCoach {
  index: string;
}

const coachSchema = Yup.object().shape({
  sportsPerson: Yup.object().required(validationTexts.requireSelect),
  startAt: Yup.date().required(validationTexts.requireText),
  endAt: Yup.date().required(validationTexts.requireText),
});

const coachLabels = {
  sportsPerson: { label: inputLabels.coach, show: true },
  startAt: { label: inputLabels.startAt, show: true },
  endAt: { label: inputLabels.endAt, show: true },
};

const AthleteCoachesContainer = ({
  coaches = {},
  handleChange,
  disabled,
}: {
  coaches: { [key: string]: AthleteCoach };
  handleChange: any;
  disabled: boolean;
}) => {
  const workRelationKeys = Object.keys(coaches);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<AthleteMembershipForm>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedWorkRelations = { ...coaches, [index]: rest };

      handleChange('athlete.sportsPerson', updatedWorkRelations);
    } else {
      handleChange('athlete.sportsPerson', { [generateUniqueString()]: values, ...coaches });
    }

    setCurrent(undefined);
  };

  const initialValues = current;

  const mappedData = {
    data: workRelationKeys.map((key) => {
      const workRelation = coaches?.[key];

      return {
        ...workRelation,
        sportsPerson: (
          <TableItem
            label={workRelation?.sportsPerson?.name}
            bottomLabel={workRelation?.sportsPerson?.id}
          />
        ),
        startAt: formatDate(workRelation?.startAt),
        endAt: formatDate(workRelation?.endAt),
        id: key,
      };
    }),
  };

  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.coaches}
        description={descriptions.coaches}
        buttonTitle={buttonsTitles.addCoach}
        disabled={disabled}
        onCreateNew={() => setCurrent({} as any)}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra priskirtų trenerių' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={coachLabels}
        onClick={(id) => {
          setCurrent({ ...coaches[id], index: id });
        }}
      />

      <Popup title={formLabels.addCoach} visible={!!current} onClose={() => setCurrent(undefined)}>
        <Formik
          validateOnChange={validateOnChange}
          enableReinitialize={false}
          initialValues={initialValues!}
          validate={() => {
            setValidateOnChange(true);
          }}
          onSubmit={onSubmit}
          validationSchema={coachSchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.sportsCoach}
                    value={values?.sportsPerson}
                    error={errors?.sportsPerson}
                    name="sportsPerson"
                    onChange={(sportsPerson) => {
                      setFieldValue(`sportsPerson`, sportsPerson);
                    }}
                    getOptionLabel={(option) => option?.name}
                    loadOptions={(input, page) =>
                      getSportsPersonList(input, page, { coach: { $exists: true } })
                    }
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
                            handleChange('athlete.coaches', omit(coaches, values.index));
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

export default AthleteCoachesContainer;
