import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FeatureCollection } from '../../types';

const mapsHost = import.meta.env.VITE_MAPS_HOST || 'https://maps.biip.lt/edit?types[]=point';

const MapField = ({
  address,
  onChange,
  disabled,
}: {
  address: string;
  onChange: (value: FeatureCollection) => void;
  disabled: boolean;
}) => {
  const iframeRef = useRef<any>(null);

  const handleSaveGeom = useCallback(
    (event: any) => {
      if (event.origin === mapsHost) {
        onChange(JSON.parse(event?.data?.mapIframeMsg.data));
      }
    },
    [onChange],
  );

  useEffect(() => {
    window.addEventListener('message', handleSaveGeom);
    return () => window.removeEventListener('message', handleSaveGeom);
  }, [handleSaveGeom]);

  const handleLoadMap = useCallback(() => {
    if (!address) return;

    iframeRef?.current?.contentWindow?.postMessage({ address }, '*');
  }, [address]);

  useEffect(() => {
    handleLoadMap();
  }, [address]);

  const mapQueryString = !disabled ? '?types[]=point' : '?preview=true';

  return (
    <Iframe
      src={`${mapsHost}/edit${mapQueryString}`}
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
  height: 600px;
  width: 100%;
  display: block;
  border: 1px solid #d4d5de;
  border-radius: 4px;
  margin-top: 8px;
`;
