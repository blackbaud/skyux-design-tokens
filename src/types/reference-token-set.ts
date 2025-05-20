import { Breakpoint } from './breakpoint';

export type ReferenceTokenSet = {
  breakpoint?: Breakpoint;
  name: string;
  path: string;
  selector?: string;
};
