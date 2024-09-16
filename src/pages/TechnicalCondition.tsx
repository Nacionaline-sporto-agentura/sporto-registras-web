import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import TextField from '../components/fields/TextField';
import FormikFormLayout from '../components/layouts/FormikFormLayout';
import FullscreenLoader from '../components/other/FullscreenLoader';
import SimpleContainer from '../components/other/SimpleContainer';
import { FormRow } from '../styles/CommonStyles';
import { DeleteInfoProps, SportsBasesCondition } from '../types';
import api from '../utils/api';
import { ClassifierTypes } from '../utils/constants';
import { handleErrorToastFromServer, isNew } from '../utils/functions';
import { slugs } from '../utils/routes';
import {
  buttonsTitles,
  deleteDescriptionFirstPart,
  deleteTitles,
  inputLabels,
  pageTitles,
  validationTexts,
} from '../utils/texts';

export const validationSchema = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
  color: Yup.string()
    .required(validationTexts.requireText)
    .test('validateColor', validationTexts.colorCode, (value) => {
      return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
    }),
});

const TechnicalCondition = () => {
  const navigate = useNavigate();

  const { id = '' } = useParams();

  const title = isNew(id) ? pageTitles.newTechnicalCondition : pageTitles.technicalCondition;

  const nameLabel = inputLabels.technicalConditionName;

  const handleNavigate = () => {
    navigate(slugs.classifiers(ClassifierTypes.TECHNICAL_CONDITION));
  };

  const { isFetching, data: technicalCondition } = useQuery(
    ['technicalCondition', id],
    () => api.getSportBaseTechnicalCondition({ id }),
    {
      onError: handleNavigate,
      enabled: !isNew(id),
    },
  );

  const createOrUpdateClassifier = useMutation(
    (params: SportsBasesCondition) =>
      !isNew(id)
        ? api.updateSportBaseTechnicalCondition({ params, id })
        : api.createSportBaseTechnicalCondition({
            params,
          }),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: handleNavigate,
      retry: false,
    },
  );

  const deleteClassifier = useMutation(() => api.deleteSportBaseTechnicalCondition({ id }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: handleNavigate,
    retry: false,
  });

  const deleteInfo: DeleteInfoProps = {
    deleteButtonText: buttonsTitles.delete,
    deleteDescriptionFirstPart: deleteDescriptionFirstPart.classifier,
    deleteDescriptionSecondPart: 'techninės būklės klasifikatorių?',
    deleteTitle: deleteTitles.classifier,
    deleteName: technicalCondition?.name || '',
    handleDelete: deleteClassifier.mutateAsync,
  };

  const handleSubmit = async (params: SportsBasesCondition) => {
    return await createOrUpdateClassifier.mutateAsync(params);
  };

  if (isFetching) return <FullscreenLoader />;

  const initialValues = {
    name: technicalCondition?.name || '',
    color: technicalCondition?.color || '',
  };

  const renderForm = (values: SportsBasesCondition, errors: any, handleChange) => {
    return (
      <SimpleContainer>
        <FormRow columns={1}>
          <TextField
            label={nameLabel}
            value={values.name}
            name="name"
            error={errors.name}
            onChange={(e) => handleChange('name', e)}
          />
          <TextField
            label={inputLabels.hexColor}
            value={values.color}
            name="color"
            error={errors.color}
            onChange={(e) => handleChange('color', e)}
          />
        </FormRow>
      </SimpleContainer>
    );
  };

  return (
    <FormikFormLayout
      title={title}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      renderForm={renderForm}
      validationSchema={validationSchema}
      deleteInfo={!isNew(id) ? deleteInfo : undefined}
    />
  );
};

export default TechnicalCondition;
