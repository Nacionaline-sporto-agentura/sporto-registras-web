import { useState } from 'react';
import { InnerContainer } from '../../styles/CommonStyles';
import { Athlete } from '../../types';
import TabSideBar from '../Tabs/TabSideBar';
import SportPersonResultsContainer from './SportPersonResults';

const sportBaseTabTitles = {
  results: 'Rezultatai',
};

const tabs = [
  {
    label: sportBaseTabTitles.results,
  },
];

const AthletePage = ({
  athlete,
  errors,
  handleChange,
  disabled,
}: {
  disabled: boolean;
  athlete: Athlete;
  errors: any;
  handleChange: any;
}) => {
  const [currentTabLabel, setCurrentTabLabel] = useState(sportBaseTabTitles.results);

  const containers = {
    [sportBaseTabTitles.results]: (
      <SportPersonResultsContainer results={Object.values(athlete?.competitionResults || [])} />
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

export default AthletePage;
