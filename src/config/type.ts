export type ChainConfig = {
  countContract: string;
  tokens: {
    [symbol: string]: {
      address: string;
      name?: string;
      decimals: number;
      logo?: string;
    };
  };
};
