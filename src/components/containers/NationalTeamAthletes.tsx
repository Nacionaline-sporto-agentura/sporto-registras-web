import { Form, Formik } from 'formik';
import { isEmpty, omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { Athlete } from '../../types';
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
  athlete: { label: inputLabels.athlete, show: true },
};

interface AthleteForm extends Athlete {
  index: number;
}

const NationalTeamAthletes = ({ athletes = {}, handleChange, disabled }) => {
  const athletesKeys = Object.keys(athletes);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<AthleteForm>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedSportBase = { ...athletes, [index]: rest };

      handleChange('athletes', updatedSportBase);
    } else {
      handleChange('athletes', { [generateUniqueString()]: values, ...athletes });
    }

    setCurrent(undefined);
  };

  const initialValues = current;

  const mappedData = {
    data: athletesKeys.map((key) => {
      const athlete = athletes?.[key];

      return {
        athlete: getFullName(athlete),
        id: key,
      };
    }),
  };

  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.athletes}
        description={descriptions.athletes}
        buttonTitle={buttonsTitles.addAthlete}
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
          setCurrent({ ...athletes[id], index: id });
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
                          $nin: Object.values(athletes).map((sportBase: any) => sportBase?.id),
                        },
                        athlete: { $exists: true },
                      })
                    }
                  />

                  {!disabled && (
                    <ButtonRow>
                      {values?.index && (
                        <Button
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('athletes', omit(athletes, values.index));
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

export default NationalTeamAthletes;
