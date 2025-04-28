import { TokenSet } from './token-set';

export type TokenConfig = {
  /**
   defaults to `src/tokens/`. Primarily used for testing.
   */
  rootPath?: string;
  tokenSets: TokenSet[];
};
