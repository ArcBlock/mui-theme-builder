import Dashboard from './Dashboard';
import LandingPage from './LandingPage';
import UserCenter from './UserCenter';

export default [
  {
    id: 'LandingPage',
    title: 'Landing Page',
    component: <LandingPage />,
  },
  {
    id: 'UserCenter',
    title: 'User Center',
    component: <UserCenter />,
  },
  {
    id: 'Dashboard',
    title: 'Dashboard',
    component: <Dashboard />,
  },
];
