import { useState } from 'react';
import { InnerContainer } from '../../styles/CommonStyles';
import { SportsPerson } from '../../types';
import TabSideBar from '../Tabs/TabSideBar';
import SportsPersonPersonalInfo from './SportsPersonPersonalInfo';

const sportBaseTabTitles = {
  personalInfo: 'Asmeninė informacija',
};

const tabs = [
  {
    label: sportBaseTabTitles.personalInfo,
  },
];

const SportsPersonGeneral = ({
  sportsPerson,
  errors,
  handleChange,
  disabled,
}: {
  disabled: boolean;
  sportsPerson: SportsPerson;
  errors: any;
  handleChange: any;
}) => {
  const [currentTabLabel, setCurrentTabLabel] = useState(sportBaseTabTitles.personalInfo);

  const containers = {
    [sportBaseTabTitles.personalInfo]: (
      <SportsPersonPersonalInfo
        sportsPerson={sportsPerson}
        errors={errors}
        handleChange={handleChange}
        disabled={disabled}
      />
    ),
  };

  return (
    <InnerContainer>
      <TabSideBar
        tabs={tabs}
        onClick={(tab) => setCurrentTabLabel(tab.label)}
        isActive={(tab) => tab.label === currentTabLabel}
      />
      {containers[currentTabLabel]}
    </InnerContainer>
  );
};

export default SportsPersonGeneral;
