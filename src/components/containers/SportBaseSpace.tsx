import * as Yup from 'yup';

import { Form, Formik, yupToFormErrors } from 'formik';
import { isEmpty, omit } from 'lodash';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { device } from '../../styles';
import { SportBaseSpace, SportsBase, TypesAndFields } from '../../types';
import api from '../../utils/api';
import { buttonsTitles, descriptions, pageTitles, validationTexts } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import { FormErrorMessage } from '../other/FormErrorMessage';
import InnerContainerRow from '../other/InnerContainerRow';
import SportBaseSpaceCard from '../other/SportBaseSpaceCard';
import TabBar from '../Tabs/TabBar';
import BuildingParametersContainer from './BuildingParameters';
import PhotosContainer from './Photos';
import SportBaseSpaceAdditionalFields from './SportBaseSpaceAdditionalFields';
import SportBaseSpaceGeneral from './SportBaseSpaceGeneral';

const generalSchema = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
  group: Yup.object().required(validationTexts.requireText),
  type: Yup.object().required(validationTexts.requireText),

  sportTypes: Yup.object().when(['type'], (items, schema) => {
    if (items[0]?.needSportType) {
      return schema.test(
        'at-least-one-property',
        validationTexts.requireSelect,
        (obj) => !isEmpty(obj),
      );
    }

    return schema.nullable();
  }),

  technicalCondition: Yup.object().required(validationTexts.requireText),
});

const buildingParametersSchema = Yup.object().shape({
  buildingNumber: Yup.string().required(validationTexts.requireText),
});

const photosSchema = Yup.object().shape({
  photos: Yup.object().test(
    'at-least-one-property',
    'Privalo būti bent viena reprezentuojanti nuotrauka',
    (obj = {}) => Object.keys(obj).some((key) => obj?.[key]?.representative === true),
  ),
});

const getValidationSchema = (additionalFields: TypesAndFields[]) => {
  const fieldValidations = (additionalFields || []).reduce((validations, item) => {
    if (item?.field?.required) {
      validations[item?.id] = Yup.string().required(validationTexts.requireText);
    }
    return validations;
  }, {});
  return Yup.object().shape({ additionalValues: Yup.object().shape(fieldValidations) });
};

const sportBaseSpaceSchema = (additionalFields: TypesAndFields[]) => {
  return Yup.object()
    .shape({})
    .concat(generalSchema)
    .concat(buildingParametersSchema)
    .concat(photosSchema)
    .concat(getValidationSchema(additionalFields));
};

export const sportBaseSpaceTabTitles = {
  generalInfo: 'Bendra informacija',
  buildingParameters: 'Erdvės parametrai',
  additionalFields: 'Papildomi laukai',
  photos: 'Nuotraukos',
};

export const getTabs = (additionalFields: TypesAndFields[]) => {
  return [
    {
      label: sportBaseSpaceTabTitles.generalInfo,
      validation: generalSchema,
    },
    {
      label: sportBaseSpaceTabTitles.buildingParameters,
      validation: buildingParametersSchema,
    },
    {
      label: sportBaseSpaceTabTitles.additionalFields,
      validation: getValidationSchema(additionalFields),
    },
    { label: sportBaseSpaceTabTitles.photos, validation: photosSchema },
  ];
};

const SportBaseSpaceContainer = ({
  spaces,
  sportBase,
  handleChange,
  errors,
  disabled,
}: {
  disabled: boolean;
  sportBase: SportsBase;
  spaces: SportBaseSpace[];
  errors: any;
  handleChange: any;
}) => {
  const title = 'Pridėti sporto erdvę';
  const [validateOnChange, setValidateOnChange] = useState<any>({});
  const [sportBaseSpaceTypeId, setSportBaseSpaceTypeId] = useState();

  const { data: additionalFields = [] } = useQuery(
    ['additionalFields', sportBaseSpaceTypeId],
    async () => {
      return api.getFields({ query: { type: sportBaseSpaceTypeId } });
    },

    {
      onSuccess: (additionalFields) => {
        const tabs = getTabs(additionalFields);
        setCurrentTabs(tabs);
      },
      enabled: !!sportBaseSpaceTypeId,
    },
  );

  const tabs = getTabs(additionalFields);
  const tabsWithoutAdditionalFields = tabs.filter((tabs) => {
    return tabs.label !== sportBaseSpaceTabTitles.additionalFields;
  });

  const [currentTabs, setCurrentTabs] = useState(tabsWithoutAdditionalFields);

  const [current, setCurrent] = useState<SportBaseSpace | {}>();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedSpaces = { ...spaces, [index]: rest };

      handleChange('spaces', updatedSpaces);
    } else {
      handleChange('spaces', { [generateUniqueString()]: values, ...spaces });
    }
    handleClear();
  };

  const handleClear = () => {
    setValidateOnChange({});
    setCurrent(undefined);
    setSportBaseSpaceTypeId(undefined);
    setCurrentTabs(tabsWithoutAdditionalFields);
    setCurrentTabIndex(0);
  };
  const initialValues: any = current || {};

  const validationSchema =
    currentTabs.length - 1 == currentTabIndex
      ? sportBaseSpaceSchema(additionalFields)
      : tabs[currentTabIndex]?.validation;

  return (
    <>
      <InnerContainerRow
        title={pageTitles.sportBaseSpaces}
        description={descriptions.sportBaseSpaces}
      />
      {Object.keys(spaces).map((key, index) => {
        const space = spaces[key];
        return (
          <React.Fragment key={index + 'space'}>
            <SportBaseSpaceCard
              disabled={disabled}
              sportBaseSpace={space}
              onEdit={() => {
                setCurrent({
                  ...space,
                  index: key,
                } as any);
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
        disabled={disabled}
      >
        {buttonsTitles.addSportBaseSpace}
      </StyledButton>
      <Popup title={title} visible={!!current} onClose={handleClear}>
        <Container>
          <TabBar
            tabs={currentTabs}
            onClick={(_, index) => setCurrentTabIndex(index || 0)}
            isActive={(_, index) => currentTabIndex == index}
          />
          <Formik
            enableReinitialize={false}
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            validateOnChange={!!validateOnChange?.all || !!validateOnChange[currentTabIndex]}
          >
            {({ values, errors, setFieldValue, setErrors }) => {
              setSportBaseSpaceTypeId(values.type?.id);

              const containers = {
                [sportBaseSpaceTabTitles.generalInfo]: (
                  <SportBaseSpaceGeneral
                    sportBaseSpace={values}
                    errors={errors}
                    handleChange={setFieldValue}
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
                    sportBase={sportBase}
                    sportBaseSpace={values}
                    errors={errors}
                    handleChange={setFieldValue}
                    disabled={disabled}
                  />
                ),
                [sportBaseSpaceTabTitles.photos]: (
                  <PhotosContainer
                    photos={values.photos}
                    errors={errors.photos}
                    handleChange={setFieldValue}
                    disabled={disabled}
                  />
                ),
              };

              const hasNext = currentTabs[currentTabIndex + 1];
              const hasPrevious = currentTabs[currentTabIndex - 1];

              return (
                <Form>
                  <Container>
                    {containers[currentTabs[currentTabIndex].label]}
                    <FormErrorMessage errors={errors} />
                    <ButtonRow>
                      {hasPrevious && (
                        <Button
                          onClick={async () => {
                            setCurrentTabIndex(currentTabIndex - 1);
                          }}
                        >
                          {buttonsTitles.back}
                        </Button>
                      )}

                      {hasNext && (
                        <Button
                          onClick={async () => {
                            {
                              try {
                                await validationSchema?.validate(values, { abortEarly: false });
                                setCurrentTabIndex(currentTabIndex + 1);
                              } catch (e) {
                                const updatedValidateOnChange = {
                                  ...validateOnChange,
                                  [currentTabIndex]: true,
                                };
                                setValidateOnChange(updatedValidateOnChange);
                                setErrors(yupToFormErrors(e));
                              }
                            }
                          }}
                        >
                          {buttonsTitles.next}
                        </Button>
                      )}

                      {!disabled && !hasNext && (
                        <Button
                          onClick={async () => {
                            let errors = {};
                            try {
                              await validationSchema?.validate(values, { abortEarly: false });
                            } catch (e) {
                              const updatedValidateOnChange = {
                                ...validateOnChange,
                                all: true,
                              };
                              setValidateOnChange(updatedValidateOnChange);
                              errors = yupToFormErrors(e);
                            }

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
                </Form>
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
