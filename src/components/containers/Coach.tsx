import { isEmpty } from 'lodash';
import { useState } from 'react';
import { InnerContainer } from '../../styles/CommonStyles';
import { ArrayToObject, Coach } from '../../types';
import TabSideBar from '../Tabs/TabSideBar';
import CoachesCompetences from './CoachesCategories';
import SportPersonBonuses from './SportsPersonBonuses';
import SportsPersonNationalTeams from './SportsPersonNationalTeams';

const sportBaseTabTitles = {
  qualificationCategory: 'Kvalifikacinė kategorija',
  bonuses: 'Premijos',
  nationalTeam: 'Nacionalinė rinktinė',
};

const tabs = [
  {
    label: sportBaseTabTitles.bonuses,
  },
  {
    label: sportBaseTabTitles.nationalTeam,
  },
  {
    label: sportBaseTabTitles.qualificationCategory,
  },
];

const labelToPropertyMap = {
  [sportBaseTabTitles.bonuses]: 'bonuses',
  [sportBaseTabTitles.nationalTeam]: 'nationalTeams',
};

const CoachPage = ({
  coach,
  handleChange,
  disabled,
}: {
  disabled: boolean;
  coach: ArrayToObject<Coach>;
  errors: any;
  handleChange: any;
}) => {
  const currentTabs = tabs.filter((tab) => {
    const property = labelToPropertyMap[tab?.label];
    return property ? !isEmpty(coach?.[property]) : true;
  });

  const [currentTabLabel, setCurrentTabLabel] = useState(currentTabs[0].label);

  const containers = {
    [sportBaseTabTitles.bonuses]: (
      <SportPersonBonuses bonuses={Object.values(coach?.bonuses || [])} />
    ),
    [sportBaseTabTitles.nationalTeam]: (
      <SportsPersonNationalTeams nationalTeams={Object.values(coach?.nationalTeams || [])} />
    ),
    [sportBaseTabTitles.qualificationCategory]: (
      <CoachesCompetences
        competences={coach?.competences || {}}
        handleChange={handleChange}
        disabled={disabled}
      />
    ),
  };
  return (
    <InnerContainer>
      <TabSideBar
        tabs={currentTabs}
        onClick={(tab) => setCurrentTabLabel(tab.label)}
        isActive={(tab) => tab.label === currentTabLabel}
      />
      {containers[currentTabLabel]}
    </InnerContainer>
  );
};

export default CoachPage;
