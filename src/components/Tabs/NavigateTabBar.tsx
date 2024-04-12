import { useNavigate } from 'react-router-dom';
import { useGetCurrentRoute } from '../../utils/hooks';
import TabBar, { Tab } from './TabBar';

const NavigateTabBar = ({ tabs, className }: { tabs: Tab[]; className?: string }) => {
  const navigate = useNavigate();
  const currentTab = useGetCurrentRoute(tabs);
  const handleClick = (tab: Tab) => {
    if (!tab?.slug) return;

    navigate(tab.slug);
  };

  return (
    <TabBar
      tabs={tabs}
      onClick={handleClick}
      isActive={(tab) => currentTab?.slug === tab.slug}
      className={className}
    />
  );
};

export default NavigateTabBar;
