import { AppBar, Tab, Tabs, Tooltip } from '@mui/material';
import React from 'react';

import BlogExample from './Admin/BlogExample';
import CheckoutExample from './Admin/CheckoutExample';
import DashboardExample from './Admin/DashboardExample';
import DefaultExample from './Admin/DefaultExample';
import DrawerExample from './Admin/DrawerExample';
import PricingExample from './Admin/PricingExample';
import SignUpExample from './Admin/SignUpExample';
import AppBarExample from './MuiComponent/AppBar';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

export const previewNavTabsId = 'preview-nav-tabs';

const tabStyle = {
  minWidth: { sm: 160 },
};

function Admin() {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<{}>, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const handleCloseDrawer = () => setDrawerOpen(false);

  return (
    <>
      <AppBarExample onDrawerButtonClick={toggleDrawer} />
      <Tooltip title='<AppBar color="primary">' placement="left" arrow>
        <AppBar position="static" id={previewNavTabsId}>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            variant="scrollable"
            textColor="inherit"
            indicatorColor="secondary"
            scrollButtons
            aria-label="preview-window-tabs"
            allowScrollButtonsMobile>
            <Tab label="Instructions" sx={tabStyle} />
            <Tab label="Sign Up" sx={tabStyle} />
            <Tab label="Dashboard" sx={tabStyle} />
            <Tab label="Blog" sx={tabStyle} />
            <Tab label="Pricing" sx={tabStyle} />
            <Tab label="Checkout" sx={tabStyle} />
          </Tabs>
        </AppBar>
      </Tooltip>

      <div>
        <DrawerExample open={drawerOpen} onClose={handleCloseDrawer} />
        <TabPanel value={tabIndex} index={0}>
          <DefaultExample />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <SignUpExample />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <DashboardExample />
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          <BlogExample />
        </TabPanel>
        <TabPanel value={tabIndex} index={4}>
          <PricingExample />
        </TabPanel>
        <TabPanel value={tabIndex} index={5}>
          <CheckoutExample />
        </TabPanel>
      </div>
    </>
  );
}

export default Admin;
