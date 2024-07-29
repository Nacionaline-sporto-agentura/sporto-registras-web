import {
  PhoneField,
  TextField,
  AsyncSelectField,
  convertGeojsonToProjection,
} from '@aplinkosministerija/design-system';
import { FormRow } from '../../styles/CommonStyles';
import { SportsBase, SportsBasesCondition, SportsBasesLevel, Types } from '../../types';
import {
  getSportBaseLevelsList,
  getSportBaseTechnicalConditionList,
  getSportBaseTypesList,
  wkbToGeoJSON,
} from '../../utils/functions';
import { descriptions, formLabels, inputLabels, pageTitles } from '../../utils/texts';
import UrlField from '../fields/UrlField';
import InnerContainerRow from '../other/InnerContainerRow';
import SimpleContainer from '../other/SimpleContainer';
import { Map } from '@aplinkosministerija/design-system';
import { pointOnFeature, buffer, distance } from '@turf/turf';

import {
  municipalitiesSearch,
  Municipality,
  ResidentialArea,
  Street,
  Address,
  residentialAreasSearch,
  streetsSearch,
  addressesSearch,
  Room,
  roomsSearch,
} from '../../utils/boundaries';

const getOption = (option?: any) => {
  if (!option) return option;
  return {
    code: option.code,
    name: option.name,
    plot_or_building_number: option.plot_or_building_number,
    room_number: option.room_number,
  };
};

const getAddress = (address: any) => {
  return {
    municipality: {
      code: address.municipality.code,
      name: address.municipality.name,
    },
    city: {
      code: address.residential_area.code,
      name: address.residential_area.name,
    },
    street: {
      code: address.street.code,
      name: address.street.name,
    },
    house: {
      code: address.code,
      plot_or_building_number: address.plot_or_building_number,
    },
    apartment: {
      code: address.code,
      room_number: address.room_number,
    },
  };
};

const SportBaseGeneralContainer = ({
  sportBase,
  errors,
  handleChange,
  disabled,
}: {
  disabled: boolean;
  sportBase: SportsBase;
  errors: any;
  handleChange: any;
}) => {
  const address = sportBase?.address;

  function handleAddressChange({
    municipality,
    city,
    street,
    house,
    apartment,
  }: {
    municipality?: Municipality;
    city?: ResidentialArea;
    street?: Street;
    house?: Address;
    apartment?: Room;
  }) {
    handleChange('address', {
      municipality,
      city,
      street,
      house,
      apartment,
    });
  }

  function getCursor(page: number | string) {
    if (typeof page !== 'string') return;
    return page;
  }

  async function getClosestAddress(geom) {
    if (!geom || !geom?.features?.length) return;
    console.log(geom);
    geom = convertGeojsonToProjection(geom, '3346', '4326');
    const pointFeature = pointOnFeature(geom);

    const buffered: any = buffer(pointFeature, 50, { units: 'meters' });

    buffered.geometry.crs = {
      type: 'name',
      properties: {
        name: 'EPSG:4326',
      },
    };

    const data = await addressesSearch({
      requestBody: {
        filters: [
          {
            geometry: {
              geojson: JSON.stringify(buffered.geometry),
              method: 'contains',
            },
          },
        ],
      },
    });

    const itemsByDistance = data?.items
      .filter((item) => !!item.geometry?.data)
      ?.map((item, index) => {
        return {
          index: index,
          point: pointOnFeature(
            convertGeojsonToProjection(
              wkbToGeoJSON(item.geometry.data) as any,
              `${item.geometry.srid}`,
              '4326',
            ),
          ),
        };
      })
      .map((item) => {
        return {
          ...item,
          distance: distance(item.point, pointFeature, { units: 'centimeters' }),
        };
      })
      .sort((item1, item2) => item1.distance - item2.distance);

    const itemIndex = itemsByDistance?.[0]?.index;
    if (typeof itemIndex === 'undefined') return;

    return data.items[itemIndex];
  }

  return (
    <>
      <InnerContainerRow title={pageTitles.info} description={descriptions.sportBaseGeneral} />
      <SimpleContainer title={formLabels.sportBaseInfo}>
        <FormRow columns={3}>
          <TextField
            disabled={disabled}
            label={inputLabels.sportBaseName}
            value={sportBase?.name}
            error={errors?.name}
            name="name"
            onChange={(name) => {
              handleChange(`name`, name);
            }}
          />
          <AsyncSelectField
            disabled={disabled}
            label={inputLabels.sportBaseType}
            value={sportBase?.type}
            error={errors?.type}
            name="type"
            onChange={(type: Types) => {
              handleChange(`type`, type);
            }}
            getOptionLabel={(option) => option?.name}
            loadOptions={(input, page) => getSportBaseTypesList(input, page)}
          />
          <AsyncSelectField
            disabled={disabled}
            label={inputLabels.technicalBaseCondition}
            value={sportBase?.technicalCondition}
            error={errors?.technicalCondition}
            name="technicalCondition"
            onChange={(source: SportsBasesCondition) => {
              handleChange(`technicalCondition`, source);
            }}
            getOptionLabel={(option) => option?.name}
            loadOptions={(input, page) => getSportBaseTechnicalConditionList(input, page)}
          />
        </FormRow>
        <FormRow columns={2}>
          <AsyncSelectField
            disabled={disabled}
            label={inputLabels.level}
            value={sportBase?.level}
            error={errors?.level}
            name="level"
            onChange={(source: SportsBasesLevel) => {
              handleChange(`level`, source);
            }}
            getOptionLabel={(option) => option?.name}
            loadOptions={(input, page) => getSportBaseLevelsList(input, page)}
          />
          <UrlField
            disabled={disabled}
            label={inputLabels.website}
            value={sportBase?.webPage}
            error={errors?.webPage}
            onChange={(endAt) => handleChange(`webPage`, endAt)}
          />
        </FormRow>
        <FormRow columns={2}>
          <PhoneField
            disabled={disabled}
            label={inputLabels.companyPhone}
            value={sportBase?.phone}
            error={errors?.phone}
            name="phone"
            placeholder="+37060000000"
            onChange={(phone) => {
              handleChange(`phone`, phone);
            }}
          />
          <TextField
            disabled={disabled}
            label={inputLabels.companyEmail}
            value={sportBase?.email}
            error={errors?.email}
            name="email"
            type="email"
            placeholder="sportobaze@sportoorg.lt"
            onChange={(email) => {
              handleChange(`email`, email);
            }}
          />
        </FormRow>
        <FormRow columns={5}>
          <AsyncSelectField
            disabled={disabled}
            label={inputLabels.municipality}
            value={sportBase?.address?.municipality}
            error={errors?.address?.municipality}
            name="address.municipality"
            optionsKey="items"
            handleGetNextPageParam={(params) => params.next_page}
            onChange={(municipality: Municipality) =>
              handleAddressChange({ municipality: getOption(municipality) })
            }
            getOptionLabel={(option) => option.name || '-'}
            loadOptions={(input, page) =>
              municipalitiesSearch({
                sortBy: 'name',
                cursor: getCursor(page),
                requestBody: { filters: [{ municipalities: { name: { contains: input } } }] },
              })
            }
          />
          <AsyncSelectField
            disabled={disabled || !sportBase?.address?.municipality}
            label={inputLabels.town}
            value={sportBase?.address?.city}
            error={errors?.address?.city}
            name="address.city"
            optionsKey="items"
            handleGetNextPageParam={(params) => params.next_page}
            onChange={(city: ResidentialArea) =>
              handleAddressChange({
                municipality: getOption(city.municipality),
                city: getOption(city),
              })
            }
            getOptionLabel={(option: ResidentialArea) => option?.name || '-'}
            loadOptions={(input, page) =>
              residentialAreasSearch({
                sortBy: 'name',
                cursor: getCursor(page),
                requestBody: {
                  filters: [
                    {
                      residential_areas: { name: { contains: input } },
                      municipalities: { codes: [address.municipality.code] },
                    },
                  ],
                },
              })
            }
          />
          <AsyncSelectField
            disabled={disabled || !sportBase?.address?.city}
            label={inputLabels.street}
            value={sportBase?.address?.street}
            error={errors?.address?.street}
            name="address.street"
            optionsKey="items"
            handleGetNextPageParam={(params) => params.next_page}
            onChange={(street: Street) => {
              handleAddressChange({
                municipality: getOption(street.residential_area.municipality),
                city: getOption(street.residential_area),
                street: getOption(street),
              });
            }}
            getOptionLabel={(option: Street) => option?.name || '-'}
            loadOptions={(input, page) =>
              streetsSearch({
                sortBy: 'name',
                cursor: getCursor(page),
                requestBody: {
                  filters: [
                    {
                      streets: { name: { contains: input } },
                      residential_areas: { codes: [address.city.code] },
                    },
                  ],
                },
              })
            }
          />
          <AsyncSelectField
            disabled={disabled || !sportBase?.address?.street}
            label={inputLabels.houseNo}
            value={sportBase?.address?.house}
            error={errors?.address?.house}
            handleGetNextPageParam={(params) => params.next_page}
            name="address.house"
            optionsKey="items"
            onChange={(address: Address) => {
              handleAddressChange({
                municipality: getOption(address.municipality),
                city: getOption(address.residential_area),
                street: getOption(address.street),
                house: getOption(address),
              });
              const geom = address?.geometry.data
                ? wkbToGeoJSON(address?.geometry.data)
                : undefined;
              if (geom) handleChange('geom', geom);
            }}
            getOptionLabel={(option: Address) => option?.plot_or_building_number || '-'}
            loadOptions={(input, page) =>
              addressesSearch({
                sortBy: 'plot_or_building_number',
                cursor: getCursor(page),
                requestBody: {
                  filters: [
                    {
                      addresses: { plot_or_building_number: { contains: input } },
                      streets: { codes: [address.street.code] },
                    },
                  ],
                },
              })
            }
          />

          <AsyncSelectField
            disabled={disabled || !sportBase?.address?.house}
            label={inputLabels.apartmentNo}
            value={sportBase?.address?.apartment}
            error={errors?.address?.apartment}
            handleGetNextPageParam={(params) => params.next_page}
            name="address.apartment"
            optionsKey="items"
            onChange={(room: Room) => {
              handleAddressChange({
                municipality: getOption(room.address.municipality),
                city: getOption(room.address.residential_area),
                street: getOption(room.address.street),
                house: getOption(room.address),
                apartment: getOption(room),
              });
            }}
            getOptionLabel={(option: Room) => option?.room_number || '-'}
            loadOptions={(input, page) =>
              roomsSearch({
                sortBy: 'room_number',
                cursor: getCursor(page),
                requestBody: {
                  filters: [
                    {
                      rooms: { room_number: { contains: input } },
                      addresses: { codes: [address.house.code] },
                    },
                  ],
                },
              })
            }
          />
        </FormRow>
        <FormRow columns={1}>
          <Map
            label={'Pažymėkite vietą'}
            onChange={async (geom) => {
              const address = await getClosestAddress(geom);
              if (!address) return handleAddressChange({}); // reset

              handleAddressChange({
                municipality: getOption(address.municipality),
                city: getOption(address.residential_area),
                street: getOption(address.street),
                house: getOption(address),
              });
            }}
            controls={{ fullscreen: true, geolocate: true, navigation: true }}
            draw={{
              types: ['point'],
              multi: false,
            }}
            value={sportBase.geom as any}
          />
        </FormRow>
      </SimpleContainer>
    </>
  );
};

export default SportBaseGeneralContainer;
