import { isEmpty } from 'lodash';
import { useState } from 'react';
import { InnerContainer } from '../../styles/CommonStyles';
import { ArrayToObject, Athlete } from '../../types';
import TabSideBar from '../Tabs/TabSideBar';
import AthleteCoachesContainer from './AthleteCoaches';
import AthleteMembershipContainer from './AthleteMembership';
import AthleteRents from './AthleteRents';
import AthleteScholarShips from './AthleteScholarShips';
import CareerEnd from './CareerEnd';
import SportPersonResultsContainer from './SportPersonResults';
import SportPersonBonuses from './SportsPersonBonuses';
import SportsPersonNationalTeams from './SportsPersonNationalTeams';

const sportBaseTabTitles = {
  results: 'Rezultatai',
  bonuses: 'Premijos',
  scholarships: 'Stipendijos',
  rents: 'Rentos',
  memberships: 'Narystės',
  nationalTeams: 'Nacionalinė rinktinė',
  coaches: 'Treneriai',
  careerEnd: 'Karjeros pabaiga',
};

const tabs = [
  {
    label: sportBaseTabTitles.results,
  },
  {
    label: sportBaseTabTitles.bonuses,
  },
  {
    label: sportBaseTabTitles.scholarships,
  },
  {
    label: sportBaseTabTitles.rents,
  },
  {
    label: sportBaseTabTitles.nationalTeams,
  },
  {
    label: sportBaseTabTitles.memberships,
  },
  {
    label: sportBaseTabTitles.coaches,
  },
  {
    label: sportBaseTabTitles.careerEnd,
  },
];

const labelToPropertyMap = {
  [sportBaseTabTitles.results]: 'competitionResults',
  [sportBaseTabTitles.bonuses]: 'bonuses',
  [sportBaseTabTitles.nationalTeams]: 'nationalTeams',
  [sportBaseTabTitles.scholarships]: 'scholarships',
  [sportBaseTabTitles.rents]: 'rents',
};

const AthletePage = ({
  athlete,
  handleChange,
  disabled,
}: {
  disabled: boolean;
  athlete: ArrayToObject<Athlete>;
  errors: any;
  handleChange: any;
}) => {
  const currentTabs = tabs.filter((tab) => {
    const property = labelToPropertyMap[tab?.label];
    return property ? !isEmpty(athlete?.[property]) : true;
  });

  const [currentTabLabel, setCurrentTabLabel] = useState(currentTabs?.[0]?.label);

  const containers = {
    [sportBaseTabTitles.results]: (
      <SportPersonResultsContainer results={Object.values(athlete?.competitionResults || [])} />
    ),
    [sportBaseTabTitles.bonuses]: (
      <SportPersonBonuses bonuses={Object.values(athlete?.bonuses || [])} />
    ),
    [sportBaseTabTitles.scholarships]: (
      <AthleteScholarShips scholarship={Object.values(athlete?.scholarships || [])} />
    ),
    [sportBaseTabTitles.rents]: <AthleteRents rents={Object.values(athlete?.rents || [])} />,
    [sportBaseTabTitles.nationalTeams]: (
      <SportsPersonNationalTeams nationalTeams={Object.values(athlete?.nationalTeams || [])} />
    ),
    [sportBaseTabTitles.memberships]: (
      <AthleteMembershipContainer
        memberships={athlete.memberships || {}}
        handleChange={handleChange}
        disabled={disabled}
      />
    ),

    [sportBaseTabTitles.coaches]: (
      <AthleteCoachesContainer
        coaches={athlete.coaches || {}}
        handleChange={handleChange}
        disabled={disabled}
      />
    ),
    [sportBaseTabTitles.careerEnd]: (
      <CareerEnd
        value={athlete?.careerEndedAt}
        handleChange={(value) => handleChange('athlete.careerEndedAt', value)}
        disabled={disabled}
        labels={{
          title: 'Sportininko karjeros pabaiga',
          description: 'Sportininko karjeros pabaigos fiksavimas',
        }}
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

export default AthletePage;
