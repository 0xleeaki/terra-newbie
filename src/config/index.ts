import { get } from 'lodash';
import { Config } from './terra';
import { ChainConfig } from './type';

export type TokenConfig = {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo?: string;
};

export const config = Config as ChainConfig;

export const getToken = (symbol: string) => {
  const tokenConfig = get(Config, ['tokens', symbol]);
  return {
    symbol,
    ...tokenConfig,
    name: tokenConfig?.name || symbol,
  } as TokenConfig;
};

export const getCountContract = () => Config.countContract;
