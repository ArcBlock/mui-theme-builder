import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export type Section = {
  title: string;
  url: string;
};

export type Post = {
  title: string;
  date?: string;
  description: string;
  image: string;
  imageText: string;
  linkText?: string;
};

export type Archive = {
  title: string;
  url: string;
};

export type Social = {
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string };
  name: string;
};

export interface SideBar {
  title: string;
  description: string;
  archives: Archive[];
  social: Social[];
}
