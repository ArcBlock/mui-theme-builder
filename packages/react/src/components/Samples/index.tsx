import Dashboard from './Dashboard';
import UserCenter from './UserCenter';
import Website from './Website';

const Samples = [
  {
    id: 'Website',
    title: 'Website',
    component: <Website />,
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

export const getSampleComponent = (id = '') => {
  let cid = id;
  let preview = Samples.find((s) => s.id === cid)?.component;

  if (!cid || !preview) {
    cid = Samples[0]?.id ?? '';
    preview = Samples[0]?.component ?? null;
  }

  return preview;
};

export default Samples;
