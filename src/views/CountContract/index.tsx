import { Fee, MsgExecuteContract } from '@terra-money/terra.js';
import { TxResult, useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { Button } from 'components/Buttons';
import { getCountContract } from 'config';
import useInterval from 'hooks/useInterval';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { screenUp } from 'utils/styles';

const CountContract: React.FC = () => {
  const lcd = useLCDClient();
  const wallet = useConnectedWallet();
  const contract = getCountContract();
  const [value, setValue] = useState<number>(0);
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txHashReset, setTxHashReset] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const getInfo = useCallback(() => {
    console.log('Get count contract info...');
    lcd.wasm.contractQuery(contract, { get_count: {} }).then((data) => {
      if (typeof data === 'object') {
        setValue((data as { count: number })?.count);
      }
    });
  }, [lcd, contract]);

  useEffect(() => {
    getInfo();
  }, [getInfo, txHash, txHashReset]);

  const increment = useCallback(() => {
    if (!wallet) {
      return;
    }
    setLoading(true);
    wallet
      .post({
        fee: new Fee(200000, { uluna: 10000 }),
        msgs: [new MsgExecuteContract(wallet.walletAddress, contract, { increment: {} })],
      })
      .then((data: TxResult) => {
        setTxHash(data.result.txhash);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [contract, wallet]);

  const reset = useCallback(() => {
    if (!wallet) {
      return;
    }
    setLoadingReset(true);
    wallet
      .post({
        fee: new Fee(200000, { uluna: 10000 }),
        msgs: [new MsgExecuteContract(wallet.walletAddress, contract, { reset: { count: 0 } })],
      })
      .then((data: TxResult) => {
        setTxHashReset(data.result.txhash);
        setLoadingReset(false);
      })
      .catch(() => {
        setLoadingReset(false);
      });
  }, [contract, wallet]);

  const checkTransactionStatus = useCallback(() => {
    if (txHash) {
      lcd.tx
        .txInfo(txHash)
        .then(() => {
          setTxHash(undefined);
        })
        .catch(() => {
          console.log('Transaction pending...');
        });
    }
    if (txHashReset) {
      lcd.tx
        .txInfo(txHashReset)
        .then(() => {
          setTxHashReset(undefined);
        })
        .catch(() => {
          console.log('Transaction pending...');
        });
    }
  }, [lcd, txHash, txHashReset]);

  useInterval(() => {
    checkTransactionStatus();
  }, 3000);

  return (
    <StyledContainer>
      <StylesTitle>Count Contract</StylesTitle>
      <StyledContent>
        <StyledRow>
          Value:
          <span>{value}</span>
        </StyledRow>
      </StyledContent>
      <StyledButtons>
        <StyledButton
          loadingSubmit={loading || !!txHash}
          disabled={loading || !!txHash}
          size="md"
          onClick={increment}
        >
          Increase
        </StyledButton>
        <StyledButton
          loadingSubmit={loadingReset || !!txHashReset}
          disabled={loadingReset || !!txHashReset}
          size="md"
          onClick={reset}
        >
          Reset
        </StyledButton>
      </StyledButtons>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  width: 100%;
  margin: 20px auto 0 auto;
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

const StyledContent = styled.div``;

const StyledButtons = styled.div`
  margin-top: 20px;
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-top: 1px dashed #2d2d3d;
`;

const StyledButton = styled(Button)``;

export default CountContract;
