import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import * as Yup from 'yup';
import { device } from '../../styles';
import { AutoFitFormRow, FormRow } from '../../styles/CommonStyles';
import { Result } from '../../types';
import api from '../../utils/api';
import { MatchTypes, ResultTypeTypes } from '../../utils/constants';
import {
  filterAndUpdateTypes,
  getSportsPersonList,
  getSportTypesList,
} from '../../utils/functions';
import {
  buttonsTitles,
  descriptions,
  formLabels,
  inputLabels,
  matchTypeLabels,
  pageTitles,
  validationTexts,
} from '../../utils/texts';
import Button from '../buttons/Button';
import ButtonsGroup from '../buttons/ButtonsGroup';
import DeleteButton from '../buttons/DeleteButton';
import AsyncMultiSelect from '../fields/AsyncMultiSelect';
import AsyncSelectField from '../fields/AsyncSelectField';
import NumericTextField from '../fields/NumericTextField';
import SelectField from '../fields/SelectField';
import TextField from '../fields/TextField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import InnerContainerRow from '../other/InnerContainerRow';
import MainTable from '../tables/MainTable';

const resultsSchema = Yup.object().shape({
  matchType: Yup.string().required(validationTexts.requireText),
  participantsNumber: Yup.string().required(validationTexts.requireText),
  match: Yup.object().required(validationTexts.requireText),
  sportType: Yup.object().required(validationTexts.requireText),
});

const resultsLabels = {
  sportsPersons: { label: inputLabels.athlete, show: true },
  sportType: { label: inputLabels.sportType, show: true },
  result: { label: inputLabels.place, show: true },
  participantsNumber: { label: inputLabels.membersNo, show: true },
  matchType: { label: inputLabels.matchType, show: true },
};

const ResultsInfo = ({ results = {}, handleChange, disabled }) => {
  const resultKeys = Object.keys(results);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<Result>();
  const otherOption = { id: 0, name: 'Kita' };

  const onSubmit = async ({ match, ...otherData }: any) => {
    const updateResults = (key: string | number, data: any) => {
      const updatedEntry = { ...data, ...(match.id && { match }) };
      handleChange('results', { ...results, [key]: updatedEntry });
    };

    if (typeof otherData.index !== 'undefined') {
      const { index, ...rest } = otherData;
      updateResults(index, rest);
    } else {
      const uniqueKey = generateUniqueString();
      updateResults(uniqueKey, otherData);
    }

    setCurrent(undefined);
  };

  const initialValues = current!;

  const data = resultKeys.map((key) => {
    const item: Result = results[key]!;
    const resultType = item?.resultType?.type;

    const result =
      resultType === ResultTypeTypes.RANGE
        ? `${item?.result?.value?.from} - ${item?.result?.value?.to}`
        : resultType === ResultTypeTypes.NUMBER
        ? item?.result?.value
        : '-';

    const sportsPersonValue = Object.values(item.sportsPersons || {});

    const sportPerson = [item?.match?.type, item?.matchType].includes(MatchTypes.TEAM)
      ? 'Komanda'
      : `${sportsPersonValue?.[0]?.firstName} ${sportsPersonValue?.[0]?.lastName}`;

    return {
      sportsPersons: sportPerson,
      sportType: item?.sportType?.name,
      result: result,
      participantsNumber: item?.participantsNumber,
      matchType: item?.matchType ? matchTypeLabels[item?.matchType] : '-',
      id: key,
    };
  });

  const { data: resultTypes = [] } = useQuery(['resultTypes'], async () =>
    api.getAllResultTypes({}),
  );

  return (
    <>
      <InnerContainerRow
        title={pageTitles.resultInfo}
        description={descriptions.resultInfo}
        buttonTitle={buttonsTitles.addResult}
        disabled={disabled}
        onCreateNew={() =>
          setCurrent({
            resultType: resultTypes.find((result) => result.type === ResultTypeTypes.NUMBER),
          } as any)
        }
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų rezultatų' }}
        isFilterApplied={false}
        hidePagination={true}
        data={{ data }}
        columns={resultsLabels}
        onClick={(id) => {
          const item: any = results[id];

          if (!item?.match?.id) {
            item.match = otherOption;
          }

          setCurrent({ ...item, index: id });
        }}
      />

      <Popup title={formLabels.addResult} visible={!!current} onClose={() => setCurrent(undefined)}>
        <FormContainer>
          <Formik
            validateOnChange={validateOnChange}
            enableReinitialize={false}
            initialValues={initialValues}
            validate={() => {
              setValidateOnChange(true);
            }}
            onSubmit={onSubmit}
            validationSchema={resultsSchema}
          >
            {({ values, errors, setFieldValue }: any) => {
              const renderResultFields = () => {
                return (
                  <AutoFitFormRow>
                    <SelectField
                      disabled={disabled}
                      label={inputLabels.result}
                      value={values.resultType}
                      error={errors?.resultType}
                      name="result"
                      getOptionLabel={(option) => option.name}
                      options={resultTypes}
                      onChange={(result) => {
                        setFieldValue(`resultType`, result);
                        setFieldValue(`result`, {});
                      }}
                    />
                    {values?.resultType?.type === ResultTypeTypes.NUMBER && (
                      <NumericTextField
                        disabled={disabled}
                        label={inputLabels.place}
                        value={values?.result?.value as number}
                        error={errors?.result?.value}
                        name="value"
                        onChange={(value) => {
                          setFieldValue(`result.value`, value);
                        }}
                      />
                    )}
                    {values?.resultType?.type == ResultTypeTypes.RANGE && (
                      <>
                        <NumericTextField
                          disabled={disabled}
                          label={inputLabels.placeFrom}
                          value={values?.result?.value?.from}
                          error={errors?.result?.value?.from}
                          maxValue={values?.result?.value?.to}
                          name="placeFrom"
                          onChange={(placeFrom) => {
                            setFieldValue(`result.value.from`, placeFrom);
                          }}
                        />
                        <NumericTextField
                          disabled={disabled}
                          label={inputLabels.placeTo}
                          value={values?.result?.value?.to}
                          minValue={values?.result?.value?.from}
                          error={errors?.result?.value?.to}
                          name="placeTo"
                          onChange={(placeTo) => {
                            setFieldValue(`result.value.to`, placeTo);
                          }}
                        />
                      </>
                    )}
                  </AutoFitFormRow>
                );
              };

              const sportTypeId = values?.sportType?.id;
              const { data: matches = [] } = useQuery(
                ['matches', sportTypeId],
                async () => api.getAllMatchTypes({ query: { sportType: sportTypeId } }),
                { enabled: !sportTypeId },
              );

              const sportsPersons = values?.sportsPersons || {};
              const sportsPersonValues = Object.values(sportsPersons || {});

              return (
                <Form>
                  <FormRow columns={1}>
                    <AsyncSelectField
                      disabled={disabled}
                      label={inputLabels.sportType}
                      value={values.sportType}
                      error={errors?.sportType}
                      name="sportType"
                      getOptionLabel={(option) => option?.name}
                      loadOptions={(input, page) => getSportTypesList(input, page)}
                      onChange={(sportType) => {
                        setFieldValue(`sportType`, sportType);
                      }}
                    />
                    <SelectField
                      disabled={disabled || !sportTypeId}
                      label={inputLabels.sportMatchType}
                      value={values.match}
                      error={errors?.match}
                      name="match"
                      getOptionLabel={(option) => option?.name}
                      options={[...matches, { id: 0, name: 'Kita' }]}
                      onChange={(match) => {
                        setFieldValue(`match`, match);
                      }}
                    />
                    {values?.match?.name === 'Kita' && (
                      <>
                        <TextField
                          disabled={disabled}
                          label={inputLabels.matchName}
                          value={values?.otherMatch}
                          error={errors?.otherMatch}
                          name="otherMatch"
                          onChange={(otherMatch) => {
                            setFieldValue(`otherMatch`, otherMatch);
                          }}
                        />
                        <ButtonsGroup
                          disabled={disabled}
                          onChange={(value) => setFieldValue('matchType', value)}
                          label={inputLabels.matchType}
                          error={errors?.matchType}
                          options={Object.values(MatchTypes)}
                          getOptionLabel={(option) => matchTypeLabels[option]}
                          isSelected={(options) => options === values.matchType}
                        />
                      </>
                    )}

                    <ButtonsGroup
                      disabled={disabled}
                      onChange={(value) => setFieldValue('selection', value)}
                      label={inputLabels.isInternationalSelection}
                      error={errors?.selection}
                      options={[true, false]}
                      getOptionLabel={(option) => (option ? 'Taip' : 'Ne')}
                      isSelected={(options) => options === values.selection}
                    />
                    {values?.match?.name === 'Kita' && (
                      <TextField
                        disabled={disabled}
                        label={inputLabels.statesCount}
                        value={values?.countriesCount}
                        error={errors?.countriesCount}
                        name="countriesCount"
                        onChange={(countriesCount) => {
                          setFieldValue(`countriesCount`, countriesCount);
                        }}
                      />
                    )}

                    {values?.sportType?.technical && (
                      <NumericTextField
                        disabled={disabled}
                        label={inputLabels.stagesCount}
                        value={values?.stages}
                        error={errors?.stages}
                        name="stages"
                        onChange={(stages) => {
                          setFieldValue(`stages`, stages);
                        }}
                      />
                    )}

                    {[values?.match?.type, values?.matchType].includes(MatchTypes.INDIVIDUAL) && (
                      <AsyncSelectField
                        disabled={disabled}
                        label={inputLabels.athlete}
                        value={sportsPersonValues[0]}
                        error={errors?.sportsPersons}
                        name="sportsPersons"
                        getOptionLabel={(option) => `${option?.firstName}  ${option?.lastName}`}
                        loadOptions={(input, page) =>
                          getSportsPersonList(input, page, { athlete: { $exists: true } })
                        }
                        onChange={(types) => {
                          filterAndUpdateTypes(
                            sportsPersons,
                            [types],
                            sportsPersonValues,
                            (filteredSportTypes) => {
                              setFieldValue('sportsPersons', filteredSportTypes);
                            },
                          );
                        }}
                      />
                    )}
                  </FormRow>
                  {[values?.match?.type, values?.matchType].includes(MatchTypes.INDIVIDUAL) && (
                    <>
                      {renderResultFields()}
                      <FormRow columns={1}>
                        <NumericTextField
                          disabled={disabled}
                          label={inputLabels.matchMemberCount}
                          value={values?.participantsNumber}
                          error={errors?.participantsNumber}
                          name="participantsNumber"
                          onChange={(participantsNumber) => {
                            setFieldValue(`participantsNumber`, participantsNumber);
                          }}
                        />
                      </FormRow>
                    </>
                  )}
                  {[values?.match?.type, values?.matchType].includes(MatchTypes.TEAM) && (
                    <TeamContainer>
                      <TeamContainerLabel>{formLabels.teamResult}</TeamContainerLabel>
                      <FormRow columns={1}>
                        <NumericTextField
                          disabled={disabled}
                          label={inputLabels.teamCount}
                          value={values?.participantsNumber}
                          error={errors?.participantsNumber}
                          name="participantsNumber"
                          onChange={(participantsNumber) => {
                            setFieldValue(`participantsNumber`, participantsNumber);
                          }}
                        />
                      </FormRow>
                      {renderResultFields()}
                      <FormRow columns={1}>
                        <AsyncMultiSelect
                          disabled={disabled}
                          label={inputLabels.athlete}
                          values={sportsPersonValues}
                          error={errors?.sportsPersons}
                          name="sportsPersons"
                          getOptionLabel={(option) => `${option?.firstName}  ${option?.lastName}`}
                          loadOptions={(input, page) =>
                            getSportsPersonList(input, page, { athlete: { $exists: true } })
                          }
                          onChange={(types) => {
                            filterAndUpdateTypes(
                              sportsPersons,
                              types,
                              sportsPersonValues,
                              (filteredSportTypes) => {
                                handleChange('sportsPersons', filteredSportTypes);
                              },
                            );
                          }}
                        />
                      </FormRow>
                    </TeamContainer>
                  )}
                  <FormRow columns={1}>
                    {!disabled && (
                      <ButtonRow>
                        {!!values?.index && (
                          <StyledButton
                            onClick={() => {
                              handleChange('results', omit(results, values.index!));
                              setCurrent(undefined);
                            }}
                          />
                        )}
                        <Button type="submit">{buttonsTitles.save}</Button>
                      </ButtonRow>
                    )}
                  </FormRow>
                </Form>
              );
            }}
          </Formik>
        </FormContainer>
      </Popup>
    </>
  );
};

const FormContainer = styled.div`
  min-width: 600px;
  @media ${device.mobileL} {
    min-width: auto;
  }
`;

const TeamContainer = styled.div`
  padding: 16px;
  margin-top: 24px;
  border-radius: 8px;
  border: 1px solid #e3e8ef;
  background-color: #f8fafc;
`;

const TeamContainerLabel = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  color: black;
`;

const StyledButton = styled(DeleteButton)`
  border: none;
  gap: 0;
  padding-left: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 32px 0 16px 0;
`;

export default ResultsInfo;
