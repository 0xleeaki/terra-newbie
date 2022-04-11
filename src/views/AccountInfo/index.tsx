import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { screenUp } from 'utils/styles';
import { getToken } from 'config';
import { parseUnits } from '@ethersproject/units';
import { BigNumberValue } from 'components/BigNumberValue';

const AccountInfo: React.FC = () => {
  const lcd = useLCDClient();
  const connectedWallet = useConnectedWallet();
  const mir = getToken('MIR');
  const [balances, setBalances] = useState<Record<string, string>>();

  const updateBalance = useCallback((symbol: string, value: string) => {
    setBalances((s) => {
      const newState = { ...s };
      newState[symbol] = value;
      return newState;
    });
  }, []);

  const getCoins = useCallback(
    (account: string) => {
      lcd.bank.balance(account).then(([_coins]) => {
        const data = _coins.toData();
        const lunaBalance = data.find((t) => t.denom === 'uluna')?.amount;
        const ustBalance = data.find((t) => t.denom === 'uusd')?.amount;
        if (lunaBalance) {
          updateBalance('LUNA', lunaBalance);
        }
        if (ustBalance) {
          updateBalance('UST', ustBalance);
        }
      });
    },
    [lcd, updateBalance],
  );

  const getTokens = useCallback(
    (account: string) => {
      lcd.wasm.contractQuery(mir.address, { balance: { address: account } }).then((data) => {
        if (typeof data === 'object') {
          updateBalance(mir.symbol, (data as { balance: string })?.balance);
        }
      });
    },
    [lcd, updateBalance, mir.address, mir.symbol],
  );

  useEffect(() => {
    if (connectedWallet) {
      getCoins(connectedWallet.terraAddress);
      getTokens(connectedWallet.terraAddress);
    } else {
      setBalances({});
    }
  }, [connectedWallet, getCoins, getTokens]);

  const getTokenBalance = useCallback(
    (symbol: string) => {
      if (!balances || !balances[symbol]) {
        return;
      }
      return parseUnits(balances && balances[symbol], 0);
    },
    [balances],
  );

  const lunaBalance = getTokenBalance('LUNA');
  const ustBalance = getTokenBalance('UST');
  const mirBalance = getTokenBalance(mir.symbol);

  return (
    <StyledContainer>
      <StylesTitle>Account Balance Info</StylesTitle>
      <StyledRow>
        LUNA Balance:
        <span>
          <BigNumberValue value={lunaBalance} decimals={6} fractionDigits={6} />
        </span>
      </StyledRow>
      <StyledRow>
        UST Balance:
        <span>
          <BigNumberValue value={ustBalance} decimals={6} fractionDigits={6} />
        </span>
      </StyledRow>
      <StyledRow>
        MIR Balance:
        <span>
          <BigNumberValue value={mirBalance} decimals={mir?.decimals} fractionDigits={6} />
        </span>
      </StyledRow>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 10px 15px 15px 15px;
  border: 1px dashed #2d2d3d;
  border-radius: 10px;
  ${screenUp('lg')`
    width: 650px;
  `}
`;

const StylesTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 20px;
`;

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  span {
    margin-left: auto;
    color: #5973fe;
    font-weight: 600;
  }
  :not(:last-child) {
    padding-bottom: 10px;
  }
`;

export default AccountInfo;
