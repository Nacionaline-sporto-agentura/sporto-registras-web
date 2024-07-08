import { useState } from 'react';
import { InnerContainer } from '../../styles/CommonStyles';
import { SportsPerson } from '../../types';
import TabSideBar from '../Tabs/TabSideBar';
import SportBasesContainer from './SportsBases';
import SportsPersonPersonalInfo from './SportsPersonPersonalInfo';
import StudiesContainer from './SportsPersonStudies';
import WorkRelationsContainer from './SportsPersonWorkRelations';

const sportBaseTabTitles = {
  personalInfo: 'Asmeninė informacija',
  education: 'Išsilavinimas',
  workRelations: 'Darbo santykiai',
  studies: 'Mokymasis ir studijos',
  sportsBase: 'Sporto bazė',
};

const tabs = [
  {
    label: sportBaseTabTitles.personalInfo,
  },
  // {
  //   label: sportBaseTabTitles.education,
  // },
  {
    label: sportBaseTabTitles.workRelations,
  },
  {
    label: sportBaseTabTitles.studies,
  },
  {
    label: sportBaseTabTitles.sportsBase,
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
        sportsPerson={sportsPerson || {}}
        errors={errors}
        handleChange={handleChange}
        disabled={disabled}
      />
    ),
    [sportBaseTabTitles.workRelations]: (
      <WorkRelationsContainer
        workRelations={sportsPerson.workRelations || {}}
        handleChange={handleChange}
        disabled={disabled}
      />
    ),
    [sportBaseTabTitles.studies]: (
      <StudiesContainer
        studies={sportsPerson.studies || {}}
        handleChange={handleChange}
        disabled={disabled}
      />
    ),
    [sportBaseTabTitles.sportsBase]: (
      <SportBasesContainer
        sportsBases={sportsPerson.sportsBases || {}}
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
