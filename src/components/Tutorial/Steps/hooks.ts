import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveTab } from 'src/state/actions';

export const useSwitchToTab = (tabName: string) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setActiveTab(tabName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabName]);
};
