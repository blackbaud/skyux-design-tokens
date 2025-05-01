import { ReferenceTokenSet } from './reference-token-set';

export type TokenSet = {
  name: string;
  path: string;
  selector: string;
  outputPath: string;
  referenceTokens: ReferenceTokenSet[];
};
