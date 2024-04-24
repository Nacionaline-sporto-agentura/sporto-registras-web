import PhotoUploadField from '../fields/PhotoUploadField';

const PhotosContainer = ({ photos, errors, handleChange, disabled }: any) => {
  const photosContainerPhotos: any = photos || {};

  return (
    <PhotoUploadField
      disabled={disabled}
      name={'photos'}
      error={errors}
      photos={photosContainerPhotos}
      onChange={handleChange}
    />
  );
};

export default PhotosContainer;
