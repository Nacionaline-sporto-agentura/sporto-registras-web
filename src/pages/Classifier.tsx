import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import TextField from '../components/fields/TextField';
import FormikFormLayout from '../components/layouts/FormikFormLayout';
import FullscreenLoader from '../components/other/FullscreenLoader';
import SimpleContainer from '../components/other/SimpleContainer';
import { DeleteInfoProps } from '../types';
import api, { Resources } from '../utils/api';
import { classifierColumns } from '../utils/columns';
import { ClassifierTypes } from '../utils/constants';
import { handleErrorToastFromServer, isNew } from '../utils/functions';
import { slugs } from '../utils/routes';
import {
  buttonsTitles,
  classifierLabels,
  deleteDescriptionFirstPart,
  deleteDescriptionSecondPart,
  deleteTitles,
  newClassifierLabels,
  validationTexts,
} from '../utils/texts';
import { GroupProps } from './GroupForm';

export const validationSchema = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
});

const createClassifierEndpoints = {
  [ClassifierTypes.LEVEL]: Resources.LEVELS,
  [ClassifierTypes.TECHNICAL_CONDITION]: Resources.TECHNICAL_CONDITIONS,
  [ClassifierTypes.SOURCE]: Resources.SPORT_BASE_INVESTMENTS_SOURCES,
  [ClassifierTypes.SPORTS_BASE_TYPE]: Resources.TYPES,
  [ClassifierTypes.SPORT_TYPE]: Resources.SPORT_TYPES,
  [ClassifierTypes.SPORT_ORGANIZATION_TYPE]: Resources.SPORT_ORGANIZATION_TYPES,
  [ClassifierTypes.LEGAL_FORMS]: Resources.LEGAL_FORMS,
  [ClassifierTypes.NATIONAL_TEAM_AGE_GROUP]: Resources.AGE_GROUPS,
  [ClassifierTypes.NATIONAL_TEAM_GENDER]: Resources.GENDERS,
  [ClassifierTypes.WORK_RELATIONS]: Resources.WORK_RELATIONS,
  [ClassifierTypes.COMPETITION_TYPE]: Resources.COMPETITION_TYPES,
  [ClassifierTypes.VIOLATIONS_ANTI_DOPING]: Resources.VIOLATIONS_ANTI_DOPING_TYPES,
  [ClassifierTypes.ORGANIZATION_BASIS]: Resources.ORGANIZATION_BASIS,
  [ClassifierTypes.RESULT_TYPE]: Resources.RESULT_TYPES,
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

  const handleNavigate = () => {
    if (!classifierType) return;

    navigate(slugs.classifiers(classifierType));
  };

  const { isFetching, data: classifier } = useQuery(
    [classifierType, id],
    () =>
      classifierType
        ? api.getOne({ resource: createClassifierEndpoints[classifierType], id })
        : Promise.resolve(),
    {
      onError: handleNavigate,
      enabled: !!classifierType && !isNew(id),
    },
  );

  const createOrUpdateClassifier = useMutation(
    (params: { name: string }) =>
      classifierType
        ? !isNew(id)
          ? api.patch({ resource: createClassifierEndpoints[classifierType], params, id })
          : api.post({
              resource: createClassifierEndpoints[classifierType],
              params,
            })
        : Promise.resolve(),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: handleNavigate,
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
      onSuccess: handleNavigate,
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
    handleDelete: deleteClassifier.mutateAsync,
  };

  const handleSubmit = async ({ name }: any) => {
    const params = {
      name: name || '',
    };
    return await createOrUpdateClassifier.mutateAsync(params);
  };

  if (isFetching) return <FullscreenLoader />;

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
      deleteInfo={!isNew(id) ? deleteInfo : undefined}
    />
  );
};

export default Classifier;
