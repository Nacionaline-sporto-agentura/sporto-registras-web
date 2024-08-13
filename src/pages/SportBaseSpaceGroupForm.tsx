import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import TextField from '../components/fields/TextField';
import FormikFormLayout from '../components/layouts/FormikFormLayout';
import FullscreenLoader from '../components/other/FullscreenLoader';
import SimpleContainer from '../components/other/SimpleContainer';
import { FormRow } from '../styles/CommonStyles';
import { DeleteInfoProps, SportsBaseSpaceGroup, SportType } from '../types';
import api from '../utils/api';
import { ClassifierTypes } from '../utils/constants';

import { handleErrorToastFromServer, isNew } from '../utils/functions';
import { slugs } from '../utils/routes';
import {
  buttonsTitles,
  deleteDescriptionFirstPart,
  deleteDescriptionSecondPart,
  deleteTitles,
  inputLabels,
  pageTitles,
  validationTexts,
} from '../utils/texts';

export const validateGroupForm = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
});

const SportBaseSpaceGroupForm = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const queryKey = ['sportBaseSpaceGroup', id];

  const title = !isNew(id)
    ? pageTitles.newSportsSpaceBaseGroup
    : pageTitles.updateSportsSpaceBaseGroup;

  const { isLoading, data: sportType } = useQuery(
    queryKey,
    () => api.getSportBaseSpaceGroup({ id }),
    {
      onError: () => {
        navigate(slugs.classifiers(ClassifierTypes.SPORTS_BASE_SPACE_GROUP));
      },
      enabled: !isNew(id),
    },
  );

  const createOrUpdateSportType = useMutation(
    (params: any) =>
      isNew(id)
        ? api.createSportBaseSpaceGroup({ params })
        : api.updateSportBaseSpaceGroup({ params, id }),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: () => {
        navigate(slugs.classifiers(ClassifierTypes.SPORTS_BASE_SPACE_GROUP));
      },
      retry: false,
    },
  );

  const deleteClassifier = useMutation(() => api.deleteSportBaseSpaceGroup({ id }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => {
      navigate(slugs.classifiers(ClassifierTypes.SPORTS_BASE_SPACE_GROUP));
    },
    retry: false,
  });

  const deleteInfo: DeleteInfoProps = {
    deleteButtonText: buttonsTitles.delete,
    deleteDescriptionFirstPart: deleteDescriptionFirstPart.classifier,
    deleteDescriptionSecondPart: deleteDescriptionSecondPart.classifier.sporto_bazes_erdves_rusis,
    deleteTitle: deleteTitles.classifier,
    deleteName: sportType?.name || '',
    handleDelete: !isNew(id) ? deleteClassifier.mutateAsync : undefined,
  };

  const initialValues: SportsBaseSpaceGroup = {
    name: sportType?.name || '',
  };

  const renderForm = (values: SportType, errors: any, handleChange) => {
    return (
      <SimpleContainer>
        <FormRow columns={1}>
          <TextField
            label={inputLabels.sportBaseSpaceGroup}
            value={values.name}
            name="name"
            error={errors.name}
            onChange={(e) => handleChange('name', e)}
          />
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

export default SportBaseSpaceGroupForm;
