import { useState } from 'react';
import { InnerContainer } from '../../styles/CommonStyles';
import { ArrayToObject, FaInstructor } from '../../types';
import TabSideBar from '../Tabs/TabSideBar';
import FaInstructorSpecialistsContainer from './FaInstructorSpecialists';

const sportBaseTabTitles = {
  faSpecialist: 'FA specialistas',
};

const tabs = [
  {
    label: sportBaseTabTitles.faSpecialist,
  },
];

const FaInstructorPage = ({
  faInstructor,
  handleChange,
  disabled,
}: {
  disabled: boolean;
  faInstructor: ArrayToObject<FaInstructor>;
  errors: any;
  handleChange: any;
}) => {
  const [currentTabLabel, setCurrentTabLabel] = useState(sportBaseTabTitles.faSpecialist);

  const containers = {
    [sportBaseTabTitles.faSpecialist]: (
      <FaInstructorSpecialistsContainer
        specialists={faInstructor?.faSpecialists || {}}
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

export default FaInstructorPage;
