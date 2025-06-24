import { Breakpoint } from './breakpoint';

export type Responsive = {
  breakpoint: Breakpoint;
  // Including container classes is the default behavior. If the property is not set, it will be treated as `true`.
  includesContainer?: Boolean;
};
