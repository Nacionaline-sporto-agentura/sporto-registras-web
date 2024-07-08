import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FeatureCollection } from '../../types';

interface MapFieldProps extends Partial<HTMLIFrameElement> {
  onChange: (value: FeatureCollection) => void;
  value?: FeatureCollection;
  disabled: boolean;
}
const mapHost = import.meta.env.VITE_MAPS_HOST || 'https://maps.biip.lt';

const MapField = ({ value, onChange, disabled }: MapFieldProps) => {
  const iframeRef = useRef<any>(null);

  const handleSaveGeom = useCallback(
    (event: any) => {
      if (event.origin === mapHost) {
        onChange(JSON.parse(event?.data?.mapIframeMsg?.data));
      }
    },
    [onChange],
  );

  useEffect(() => {
    window.addEventListener('message', handleSaveGeom);
    return () => window.removeEventListener('message', handleSaveGeom);
  }, [handleSaveGeom]);

  const handleLoadMap = () => {
    if (!value) return;
    iframeRef?.current?.contentWindow?.postMessage({ geom: value }, '*');
  };

  const mapQueryString = !disabled ? '?types[]=point' : '?preview=true';

  return (
    <Iframe
      src={`${mapHost}/edit${mapQueryString}`}
      ref={iframeRef}
      width={'100%'}
      allowFullScreen={true}
      onLoad={handleLoadMap}
      aria-hidden="false"
      tabIndex={1}
    />
  );
};

export default MapField;

const Iframe = styled.iframe`
  height: 450px;
  width: 100%;
  display: block;
  border: 1px solid #d4d5de;
  border-radius: 4px;
  margin-top: 8px;
`;
