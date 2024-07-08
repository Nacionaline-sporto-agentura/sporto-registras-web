import { useState } from 'react';
import { InnerContainer } from '../../styles/CommonStyles';
import { AmsInstructor, ArrayToObject } from '../../types';
import TabSideBar from '../Tabs/TabSideBar';
import AmsInstructorCoachesContainer from './AmsInstructorCoaches';

const sportBaseTabTitles = {
  coaches: 'Treneris',
};

const tabs = [
  {
    label: sportBaseTabTitles.coaches,
  },
];

const AmsInstructorPage = ({
  amsInstructor,
  handleChange,
  disabled,
}: {
  disabled: boolean;
  amsInstructor: ArrayToObject<AmsInstructor>;
  errors: any;
  handleChange: any;
}) => {
  const [currentTabLabel, setCurrentTabLabel] = useState(sportBaseTabTitles.coaches);

  const containers = {
    [sportBaseTabTitles.coaches]: (
      <AmsInstructorCoachesContainer
        coaches={amsInstructor?.coaches || {}}
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

export default AmsInstructorPage;
