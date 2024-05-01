import { SportBase } from '../../types';
import { descriptions, pageTitles } from '../../utils/texts';
import PhotoUploadField from '../fields/PhotoUploadField';
import InnerContainerRow from '../other/InnerContainerRow';
import SimpleContainer from '../other/SimpleContainer';

const SportBasePhotos = ({
  sportBase,
  errors,
  handleChange,
  disabled,
}: {
  disabled: boolean;
  sportBase: SportBase;
  errors: any;
  handleChange: any;
}) => {
  const photos: any = sportBase?.photos || {};

  return (
    <>
      <InnerContainerRow title={pageTitles.sportBasePhotos} description={descriptions.photos} />
      <PhotoUploadField
        disabled={disabled}
        name={'photos'}
        error={errors?.photos}
        photos={photos}
        onChange={handleChange}
      />
    </>
  );
};

export default SportBasePhotos;
