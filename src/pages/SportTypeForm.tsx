import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import TextField from '../components/fields/TextField';
import FormikFormLayout from '../components/layouts/FormikFormLayout';
import FullscreenLoader from '../components/other/FullscreenLoader';
import SimpleContainer from '../components/other/SimpleContainer';
import { FormRow } from '../styles/CommonStyles';
import { DeleteInfoProps, SportType } from '../types';
import api from '../utils/api';
import { ClassifierTypes, SportTypeButtonKeys } from '../utils/constants';

import { handleErrorToastFromServer, isNew } from '../utils/functions';
import { slugs } from '../utils/routes';
import {
  buttonsTitles,
  deleteDescriptionFirstPart,
  deleteDescriptionSecondPart,
  deleteTitles,
  falseLabels,
  inputLabels,
  pageTitles,
  trueLabels,
  validationTexts,
} from '../utils/texts';

export const validateGroupForm = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
});

const ButtonsInfo = [
  {
    key: SportTypeButtonKeys.olympic,
    label: inputLabels.isOlympic,
  },
  {
    key: SportTypeButtonKeys.paralympic,
    label: inputLabels.isParalympic,
  },
  {
    key: SportTypeButtonKeys.strategic,
    label: inputLabels.isStrategic,
  },
  {
    key: SportTypeButtonKeys.technical,
    label: inputLabels.isTechnical,
  },
  {
    key: SportTypeButtonKeys.deaf,
    label: inputLabels.isDeafs,
  },
  {
    key: SportTypeButtonKeys.specialOlympics,
    label: inputLabels.isSpecialOlympic,
  },
];

const SportTypeForm = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();

  const title = !isNew(id) ? pageTitles.updateSportType : pageTitles.newSportType;

  const { isLoading, data: sportType } = useQuery(
    ['sportType', id],
    () => api.getSportType({ id }),
    {
      onError: () => {
        navigate(slugs.classifiers(ClassifierTypes.SPORT_TYPE));
      },
      enabled: !isNew(id),
    },
  );

  const createOrUpdateSportType = useMutation(
    (params: any) =>
      isNew(id) ? api.createSportType({ params }) : api.updateSportType({ params, id }),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: () => {
        navigate(slugs.classifiers(ClassifierTypes.SPORT_TYPE));
      },
      retry: false,
    },
  );

  const deleteClassifier = useMutation(() => api.deleteSportType({ id }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => {
      navigate(slugs.classifiers(ClassifierTypes.SPORT_TYPE));
    },
    retry: false,
  });

  const deleteInfo: DeleteInfoProps = {
    deleteButtonText: buttonsTitles.delete,
    deleteDescriptionFirstPart: deleteDescriptionFirstPart.classifier,
    deleteDescriptionSecondPart: deleteDescriptionSecondPart.classifier.sporto_saka,
    deleteTitle: deleteTitles.classifier,
    deleteName: sportType?.name || '',
    handleDelete: deleteClassifier.mutateAsync,
  };

  const initialValues: SportType = {
    name: sportType?.name || '',
    olympic: sportType?.olympic || false,
    paralympic: sportType?.paralympic || false,
    strategic: sportType?.strategic || false,
    technical: sportType?.technical || false,
    deaf: sportType?.deaf || false,
    specialOlympics: sportType?.specialOlympics || false,
  };

  const renderForm = (values: SportType, errors: any, handleChange) => {
    const renderButtonsGroup = ({ label, key }) => {
      return (
        <ButtonsGroup
          onChange={(value) => handleChange(key, value)}
          label={label}
          options={[true, false]}
          getOptionLabel={(option) => (option ? trueLabels[key] : falseLabels[key])}
          isSelected={(options) => options === values[key]}
        />
      );
    };

    return (
      <SimpleContainer>
        <FormRow columns={1}>
          <TextField
            label={inputLabels.sportTypeName}
            value={values.name}
            name="name"
            error={errors.name}
            onChange={(e) => handleChange('name', e)}
          />
        </FormRow>
        <FormRow columns={2}>
          {ButtonsInfo.map((buttonInfo) => {
            return (
              <React.Fragment key={JSON.stringify(buttonInfo)}>
                {renderButtonsGroup({ ...buttonInfo })}
              </React.Fragment>
            );
          })}
        </FormRow>
      </SimpleContainer>
    );
  };

  if (isLoading) {
    return <FullscreenLoader />;
  }

  return (
    <FormikFormLayout
      title={title}
      initialValues={initialValues}
      onSubmit={createOrUpdateSportType.mutateAsync}
      renderForm={renderForm}
      validationSchema={validateGroupForm}
      deleteInfo={deleteInfo}
    />
  );
};

export default SportTypeForm;
