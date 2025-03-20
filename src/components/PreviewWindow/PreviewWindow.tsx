import { AppBar, Tab, Tabs, Tooltip } from '@mui/material';
import React from 'react';
import AppBarExample from 'src/components/MuiComponentSamples/Samples/AppBar';

import PreviewWrapper from './PreviewWrapper';
import BlogExample from './Samples/BlogExample';
import CheckoutExample from './Samples/CheckoutExample';
import DashboardExample from './Samples/DashboardExample';
import DefaultExample from './Samples/DefaultExample';
import DrawerExample from './Samples/DrawerExample';
import PricingExample from './Samples/PricingExample';
import SignUpExample from './Samples/SignUpExample';

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

function PreviewWindow() {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<{}>, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const handleCloseDrawer = () => setDrawerOpen(false);

  return (
    <PreviewWrapper>
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
    </PreviewWrapper>
  );
}

export default PreviewWindow;
