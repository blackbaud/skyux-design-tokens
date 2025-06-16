import { Responsive } from './responsive';

export type ReferenceTokenSet = {
  name: string;
  path: string;
  responsive?: Responsive;
  selector?: string;
};
