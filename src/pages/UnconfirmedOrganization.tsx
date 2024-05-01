import { useQuery } from 'react-query';
import Api from '../utils/api';
import { handleErrorToastFromServer } from '../utils/functions';
import { pageTitles } from '../utils/texts';

import { useParams } from 'react-router-dom';
import OrganizationExtendedForm from '../components/forms/OrganizationExtendedForm';
import { TenantTypes } from '../utils/constants';
import { useIsTenantAdmin } from '../utils/hooks';

export interface InstitutionProps {
  companyName?: string;
  companyCode?: string;
  companyPhone?: string;
  address?: string;
  companyEmail: string;
  tenantType?: TenantTypes;
  parent?: any;
  data?: {
    url: string;
    foundedAt: Date;
    hasBeneficiaryStatus: true;
    nonGovernmentalOrganization: false;
    nonFormalEducation: false;
    legalForm: string;
    type: string;
  };
}

const UnconfirmedOrganization = () => {
  const title = pageTitles.updateOrganization;
  const { id = '' } = useParams();
  const isTenantAdmin = useIsTenantAdmin();
  const { isFetching, data: organization } = useQuery(
    ['organization', id],
    () => Api.getTenant({ id: id }),
    {
      onError: () => {
        handleErrorToastFromServer();
      },
      refetchOnWindowFocus: false,
    },
  );

  const disabled = !isTenantAdmin || !organization?.lastRequest?.canEdit;

  const initialValues: any = {
    companyName: organization?.name || '',
    companyCode: organization?.code || '',
    companyPhone: organization?.phone || '',
    companyEmail: organization?.email || '',
    address: organization?.address || '',
    parent: organization?.parent || '',
    tenantType: organization?.tenantType || '',
    data: { ...organization?.data },
    ...organization,
  };

  return (
    <OrganizationExtendedForm
      title={title}
      groupOptions={[]}
      disabled={disabled}
      organization={{ ...initialValues, ...organization }}
      isLoading={isFetching}
      id={id}
    />
  );
};

export default UnconfirmedOrganization;
