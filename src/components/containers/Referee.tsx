import { useState } from 'react';
import { InnerContainer } from '../../styles/CommonStyles';
import { ArrayToObject, Referee } from '../../types';
import TabSideBar from '../Tabs/TabSideBar';
import CareerEnd from './CareerEnd';
import RefereeCategoriesContainer from './RefereeCategories';

const sportBaseTabTitles = {
  category: 'Kategorija',
  careerEnd: 'Karjeros pabaiga',
};

const tabs = [
  {
    label: sportBaseTabTitles.category,
  },
  {
    label: sportBaseTabTitles.careerEnd,
  },
];

const RefereePage = ({
  referee,
  handleChange,
  disabled,
}: {
  disabled: boolean;
  referee: ArrayToObject<Referee>;
  errors: any;
  handleChange: any;
}) => {
  const [currentTabLabel, setCurrentTabLabel] = useState(sportBaseTabTitles.category);

  const containers = {
    [sportBaseTabTitles.category]: (
      <RefereeCategoriesContainer
        categories={referee?.categories || {}}
        handleChange={handleChange}
        disabled={disabled}
      />
    ),
    [sportBaseTabTitles.careerEnd]: (
      <CareerEnd
        value={referee?.careerEndedAt}
        handleChange={(value) => handleChange('referee.careerEndedAt', value)}
        disabled={disabled}
        labels={{
          title: 'Teisėjo karjeros pabaiga',
          description: 'Sporto asmens karjeros pabaigos fiksavimas',
        }}
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

export default RefereePage;
