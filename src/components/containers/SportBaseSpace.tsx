import * as Yup from 'yup';

import { Formik, yupToFormErrors } from 'formik';
import { isEmpty, omit } from 'lodash';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { device } from '../../styles';
import { SportBaseSpace } from '../../types';
import api from '../../utils/api';
import { buttonsTitles, validationTexts } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import Popup from '../layouts/Popup';
import { FormErrorMessage } from '../other/FormErrorMessage';
import SportBaseSpaceCard from '../other/SportBaseSpaceCard';
import TabBar from '../Tabs/TabBar';
import BuildingParametersContainer from './BuildingParameters';
import PhotosContainer from './Photos';
import SportBaseSpaceAdditionalFields from './SportBaseSpaceAdditionalFields';
import SportBaseSpaceGeneral from './SportBaseSpaceGeneral';

const generalSchema = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
  type: Yup.object().required(validationTexts.requireText),
  sportTypes: Yup.object().test(
    'at-least-one-property',
    validationTexts.requireSelect,
    (obj) => !isEmpty(obj),
  ),
  technicalCondition: Yup.object().required(validationTexts.requireText),
});

const buildingParametersSchema = Yup.object().shape({
  buildingType: Yup.object().required(validationTexts.requireText),
  buildingNumber: Yup.string().required(validationTexts.requireText),
  buildingPurpose: Yup.string().required(validationTexts.requireText),
  buildingArea: Yup.string().required(validationTexts.requireText),
  energyClass: Yup.string().required(validationTexts.requireText),
  constructionDate: Yup.date().required(validationTexts.requireText),
  latestRenovationDate: Yup.date().required(validationTexts.requireText),
  energyClassCertificate: Yup.object().required(validationTexts.requireText),
});

const photosSchema = Yup.object().shape({
  photos: Yup.object().test(
    'at-least-one-property',
    'Privalo būti bent viena reprezentuojanti nuotrauka',
    (obj = {}) => Object.keys(obj).some((key) => obj?.[key]?.representative === true),
  ),
});

const sportBaseSpaceSchema = Yup.object()
  .shape({})
  .concat(generalSchema)
  .concat(buildingParametersSchema)
  .concat(photosSchema);

export const sportBaseSpaceTabTitles = {
  generalInfo: 'Bendra informacija',
  buildingParameters: 'Statinio parametrai',
  additionalFields: 'Papildomi laukai',
  photos: 'Nuotraukos',
};

export const tabs = [
  {
    label: sportBaseSpaceTabTitles.generalInfo,
    validation: generalSchema,
  },
  {
    label: sportBaseSpaceTabTitles.buildingParameters,
    validation: buildingParametersSchema,
  },
  { label: sportBaseSpaceTabTitles.additionalFields },
  { label: sportBaseSpaceTabTitles.photos, validation: photosSchema },
];

const SportBaseSpaceContainer = ({
  spaces,
  sportBaseTypeId,
  handleChange,
  errors,
  sportBaseCounter,
  disabled,

  setSportBaseCounter,
}: {
  sportBaseCounter: number;
  disabled: boolean;
  setSportBaseCounter: (num: number) => void;
  spaces: SportBaseSpace[];
  sportBaseTypeId: number;
  errors: any;
  handleChange: any;
}) => {
  const title = 'Pridėti sporto erdvę';
  const [currentTabs, setCurrentTabs] = useState(
    tabs.filter((tabs) => {
      return tabs.label !== sportBaseSpaceTabTitles.additionalFields;
    }),
  );

  const [current, setCurrent] = useState<SportBaseSpace | {}>();

  const [currentTab, setCurrentTab] = useState(0);

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;
      spaces[index] = rest;

      handleChange('spaces', spaces);
    } else {
      handleChange('spaces', { [sportBaseCounter]: values, ...spaces });
      setSportBaseCounter(sportBaseCounter + 1);
    }

    setCurrent(undefined);
  };

  const initialValues: any = current || {};
  const buttonDisabled = disabled || !sportBaseTypeId;

  return (
    <>
      {Object.keys(spaces).map((key, index) => {
        const space = spaces[key];
        return (
          <React.Fragment key={index + 'space'}>
            <SportBaseSpaceCard
              disabled={disabled}
              sportBaseSpace={space}
              onEdit={() => {
                setCurrent({ ...space, index: key } as any);
              }}
              onDelete={() => {
                handleChange('spaces', omit(spaces, key));
              }}
            />
          </React.Fragment>
        );
      })}

      <StyledButton
        error={!!errors}
        onClick={() => {
          setCurrent({});
        }}
        variant={ButtonColors.TRANSPARENT}
        borderType={'dashed'}
        disabled={buttonDisabled}
      >
        {buttonsTitles.addSportBaseSpace}
      </StyledButton>
      <Popup title={title} visible={!!current} onClose={() => setCurrent(undefined)}>
        <Container>
          <TabBar
            tabs={currentTabs}
            onClick={(_, index) => setCurrentTab(index || 0)}
            isActive={(_, index) => currentTab == index}
          />
          <Formik
            validateOnChange={false}
            enableReinitialize={false}
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={sportBaseSpaceSchema}
          >
            {({ values, errors, setFieldValue, validateForm, setErrors }) => {
              const sportBaseSpaceTypeId = values.type?.id;

              const [sportTypesCounter, setSportTypeCounter] = useState(
                Object.keys(values.sportTypes || {}).length,
              );
              const [photosCounter, setPhotosCounter] = useState(
                Object.keys(values.sportTypes || {}).length,
              );

              const { data: additionalFields = [] } = useQuery(
                ['additionalFields', sportBaseSpaceTypeId],
                async () => {
                  setCurrentTabs(tabs);

                  return api.getFields({ query: { type: sportBaseSpaceTypeId } });
                },
                {
                  enabled: !!sportBaseSpaceTypeId,
                },
              );

              const containers = {
                [sportBaseSpaceTabTitles.generalInfo]: (
                  <SportBaseSpaceGeneral
                    sportBaseTypeId={sportBaseTypeId}
                    sportBaseSpace={values}
                    errors={errors}
                    handleChange={setFieldValue}
                    setCounter={setSportTypeCounter}
                    counter={sportTypesCounter}
                    disabled={disabled}
                  />
                ),
                [sportBaseSpaceTabTitles.additionalFields]: (
                  <SportBaseSpaceAdditionalFields
                    additionalValues={values.additionalValues}
                    additionalFields={additionalFields}
                    errors={errors.additionalValues}
                    handleChange={setFieldValue}
                    disabled={disabled}
                  />
                ),
                [sportBaseSpaceTabTitles.buildingParameters]: (
                  <BuildingParametersContainer
                    sportBaseSpace={values}
                    errors={errors}
                    handleChange={setFieldValue}
                    disabled={disabled}
                  />
                ),
                [sportBaseSpaceTabTitles.photos]: (
                  <PhotosContainer
                    counter={photosCounter}
                    setCounter={setPhotosCounter}
                    photos={values.photos}
                    errors={errors.photos}
                    handleChange={setFieldValue}
                    disabled={disabled}
                  />
                ),
              };

              const hasNext = tabs[currentTab + 1];
              const hasPrevious = tabs[currentTab - 1];

              return (
                <Container>
                  {containers[tabs[currentTab].label]}
                  <FormErrorMessage errors={errors} />
                  <ButtonRow>
                    {hasPrevious && (
                      <Button
                        onClick={async () => {
                          setCurrentTab(currentTab - 1);
                        }}
                      >
                        {buttonsTitles.back}
                      </Button>
                    )}

                    {hasNext && (
                      <Button
                        onClick={async () => {
                          {
                            const partialValidationSchema = tabs[currentTab]?.validation;
                            if (!partialValidationSchema) {
                              const errors: any = {};

                              additionalFields.forEach((item) => {
                                if (typeof values?.additionalValues?.[item?.id] === 'undefined') {
                                  errors.additionalValues = errors.additionalValues || {};

                                  errors.additionalValues[item?.id] = validationTexts.requireText;
                                }
                              });

                              if (isEmpty(errors)) {
                                setCurrentTab(currentTab + 1);
                              }

                              return setErrors(errors);
                            }

                            partialValidationSchema
                              .validate(values, { abortEarly: false })
                              .then(() => setCurrentTab(currentTab + 1))
                              .catch((error) => {
                                setErrors(yupToFormErrors(error));
                              });
                          }
                        }}
                      >
                        {buttonsTitles.next}
                      </Button>
                    )}

                    {!disabled && !hasNext && (
                      <Button
                        onClick={async (e) => {
                          const errors = (await validateForm(values)) as any;

                          additionalFields.forEach((item) => {
                            if (typeof values?.additionalValues?.[item?.id] === 'undefined') {
                              errors.additionalValues = errors.additionalValues || {};

                              errors.additionalValues[item?.id] = validationTexts.requireText;
                            }
                          });

                          setErrors(errors);

                          if (isEmpty(errors)) {
                            onSubmit(values);
                          }
                        }}
                      >
                        {buttonsTitles.save}
                      </Button>
                    )}
                  </ButtonRow>
                </Container>
              );
            }}
          </Formik>
        </Container>
      </Popup>
    </>
  );
};

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  margin: 16px 0;
`;

const Container = styled.div`
  margin-top: 32px;
  width: 900px;
  @media ${device.tablet} {
    width: 100%;
  }
`;

const StyledButton = styled(Button)<{
  error: boolean;
}>`
  border-color: ${({ error }) => (error ? 'red' : '#CDD5DF')};
`;

export default SportBaseSpaceContainer;
