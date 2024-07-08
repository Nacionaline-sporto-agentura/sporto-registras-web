import { Form, Formik } from 'formik';
import { isEmpty, omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { Coach } from '../../types';
import { getFullName, getSportsPersonList } from '../../utils/functions';
import {
  buttonsTitles,
  descriptions,
  inputLabels,
  pageTitles,
  validationTexts,
} from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import AsyncSelectField from '../fields/AsyncSelectField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import MainTable from '../tables/MainTable';

const schema = Yup.object().shape({
  id: Yup.number().required(validationTexts.requireSelect),
});

const labels = {
  coach: { label: inputLabels.coach, show: true },
};

interface CoachForm extends Coach {
  index: number;
}

const NationalTeamCoaches = ({ coaches = {}, handleChange, disabled }) => {
  const coachesKeys = Object.keys(coaches);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<CoachForm>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedSportBase = { ...coaches, [index]: rest };

      handleChange('coaches', updatedSportBase);
    } else {
      handleChange('coaches', { [generateUniqueString()]: values, ...coaches });
    }

    setCurrent(undefined);
  };

  const initialValues = current;

  const mappedData = {
    data: coachesKeys.map((key) => {
      const coach = coaches?.[key];

      return {
        coach: getFullName(coach),
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
        notFoundInfo={{ text: 'Nėra paskirtų sportininkų' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={labels}
        onClick={(id) => {
          setCurrent({ ...coaches[id], index: id });
        }}
      />

      <Popup
        title={buttonsTitles.addSportBase}
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
          validationSchema={schema}
        >
          {({ values, errors, setValues }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.companyNameCode}
                    value={isEmpty(values) ? undefined : values}
                    error={errors?.id}
                    name="nationalTeamsAthletes"
                    onChange={(sportBase) => {
                      setValues(sportBase);
                    }}
                    getOptionLabel={getFullName}
                    loadOptions={(input, page) =>
                      getSportsPersonList(input, page, {
                        id: {
                          $nin: Object.values(coaches).map((sportBase: any) => sportBase?.id),
                        },
                        coach: { $exists: true },
                      })
                    }
                  />

                  {!disabled && (
                    <ButtonRow>
                      {values?.index && (
                        <Button
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('coaches', omit(coaches, values.index));
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

export default NationalTeamCoaches;
