import { Photo } from '../../types';
import PhotoUploadField from '../fields/PhotoUploadField';

const PhotosContainer = ({ photos, errors, handleChange, counter, setCounter, disabled }: any) => {
  const ObjectPhotos = photos || {};
  const photoValues = Object.values(ObjectPhotos) as any;

  return (
    <PhotoUploadField
      disabled={disabled}
      name={'photos'}
      error={errors}
      photos={photoValues}
      onChange={(name, value: Photo[]) => {
        if (typeof value !== 'object') {
          return handleChange(name, value);
        }

        const filteredPhotos = {};
        let tempCounter = counter;

        Object.entries(ObjectPhotos).forEach(([key, type]) => {
          const found = value.find((c) => c.url === (type as any)?.url);

          if (found) {
            filteredPhotos[key] = found;
          }
        });

        value.forEach((type) => {
          if (photoValues.every((sportValue: any) => sportValue.url !== type.url)) {
            filteredPhotos[tempCounter] = type;
            tempCounter++;
          }
        });
        setCounter(tempCounter);
        handleChange(name, filteredPhotos);
      }}
    />
  );
};

export default PhotosContainer;
