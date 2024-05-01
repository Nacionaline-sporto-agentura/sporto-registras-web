import React from 'react';
import FormikFormLayout from '../components/layouts/FormikFormLayout';
import { useNavigate, useParams } from 'react-router-dom';
import {
  buttonsTitles,
  classifierLabels,
  deleteDescriptionFirstPart,
  deleteDescriptionSecondPart,
  deleteTitles,
  newClassifierLabels,
  validationTexts,
} from '../utils/texts';
import SimpleContainer from '../components/other/SimpleContainer';
import TextField from '../components/fields/TextField';
import { GroupProps } from './GroupForm';
import { classifierColumns } from '../utils/columns';
import { useMutation, useQuery } from 'react-query';
import { handleErrorToastFromServer, isCurrentUser, isNew } from '../utils/functions';
import api, { Resources } from '../utils/api';
import { slugs } from '../utils/routes';
import { ClassifierTypes } from '../utils/constants';
import * as Yup from 'yup';
import { DeleteInfoProps } from '../types';

export const validationSchema = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
});

const createClassifierEndpoints = {
  [ClassifierTypes.LEVEL]: Resources.LEVELS,
  [ClassifierTypes.TECHNICAL_CONDITION]: Resources.TECHNICAL_CONDITIONS,
  [ClassifierTypes.SPACE_TYPE]: Resources.SPACE_TYPES,
  [ClassifierTypes.SOURCE]: Resources.SPORT_BASE_INVESTMENTS_SOURCES,
  [ClassifierTypes.SPORTS_BASE_TYPE]: Resources.TYPES,
  [ClassifierTypes.BUILDING_TYPE]: Resources.BUILDING_TYPES,
  [ClassifierTypes.SPORT_TYPE]: Resources.SPORT_TYPES,
};

const Classifier = () => {
  const navigate = useNavigate();
  const { dynamic: classifierType } = useParams<{ dynamic: string }>();
  const { id = '' } = useParams();

  const title = classifierType
    ? isNew(id)
      ? newClassifierLabels[classifierType]
      : classifierLabels[classifierType]
    : '';

  const nameLabel = classifierType ? classifierColumns[classifierType].name.label : '';

  const { isFetching, data: classifier } = useQuery(
    [classifierType, id],
    () =>
      classifierType
        ? api.getOne({ resource: createClassifierEndpoints[classifierType], id })
        : Promise.resolve(),
    {
      onError: () => {
        navigate(slugs.adminUsers);
      },
      enabled: !!classifierType && !isNew(id),
    },
  );

  const createClassifier = useMutation(
    (params: { name: string }) =>
      classifierType
        ? api.post({
            resource: createClassifierEndpoints[classifierType],
            params,
          })
        : Promise.resolve(),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: () => {
        classifierType && navigate(slugs.classifiers(classifierType));
      },
      retry: false,
    },
  );

  const updateClassifier = useMutation(
    (params: { name: string }) =>
      classifierType && id
        ? api.patch({ resource: createClassifierEndpoints[classifierType], id, params })
        : Promise.resolve(),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: () => {
        classifierType && navigate(slugs.classifiers(classifierType));
      },
      retry: false,
    },
  );

  const deleteClassifier = useMutation(
    () =>
      classifierType && id
        ? api.delete({ resource: createClassifierEndpoints[classifierType], id })
        : Promise.resolve(),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: () => {
        classifierType && navigate(slugs.classifiers(classifierType));
      },
      retry: false,
    },
  );

  const deleteInfo: DeleteInfoProps = {
    deleteButtonText: buttonsTitles.delete,
    deleteDescriptionFirstPart: deleteDescriptionFirstPart.classifier,
    deleteDescriptionSecondPart: classifierType
      ? deleteDescriptionSecondPart.classifier[classifierType]
      : '',
    deleteTitle: deleteTitles.classifier,
    deleteName: classifier?.name || '',
    handleDelete: !isNew(id) ? deleteClassifier.mutateAsync : undefined,
  };

  const handleSubmit = async ({ name }: any) => {
    const params = {
      name: name || '',
    };
    if (isNew(id)) {
      return await createClassifier.mutateAsync(params);
    }
    return await updateClassifier.mutateAsync(params);
  };

  const renderForm = (values: GroupProps, errors: any, handleChange) => {
    return (
      <SimpleContainer>
        <TextField
          label={nameLabel}
          value={values.name}
          name="name"
          error={errors.name}
          onChange={(e) => handleChange('name', e)}
        />
      </SimpleContainer>
    );
  };

  return (
    <FormikFormLayout
      title={title}
      initialValues={{ name: classifier?.name || '' }}
      onSubmit={handleSubmit}
      renderForm={renderForm}
      validationSchema={validationSchema}
      deleteInfo={deleteInfo}
    />
  );
};

export default Classifier;
