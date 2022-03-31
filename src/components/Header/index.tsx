import { ConnectType, useWallet } from '@terra-money/wallet-provider';
import { Button } from 'components/Buttons';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { shortenAddress } from 'utils/addresses';
import { screenUp } from 'utils/styles';

const Header: React.FC = () => {
  const { network, wallets, connect, disconnect } = useWallet();

  const account = useMemo(() => {
    return wallets.length ? wallets[0].terraAddress : undefined;
  }, [wallets]);

  const shortenAccount = shortenAddress(account || '');

  const onConnect = useCallback(() => {
    return connect(ConnectType.EXTENSION, 'station');
  }, [connect]);

  return (
    <StyledHeader>
      <LeftSide />
      <RightSide>
        {account ? (
          <AccountInfo>
            <StyledInfo>{network.name}</StyledInfo>
            <StyledInfo>{shortenAccount}</StyledInfo>
            <Button size="md" onClick={disconnect}>
              Disconnect
            </Button>
          </AccountInfo>
        ) : (
          <Button size="md" onClick={onConnect}>
            Connect wallet
          </Button>
        )}
      </RightSide>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 10px;
  border-bottom: 1px solid #2d2d3d;
  ${screenUp('lg')`
    padding: 0 8px;
  `}
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  ${screenUp('lg')`
    width: 750px;
  `}
`;

const RightSide = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  ${screenUp('lg')`
    position: relative;
    z-index: 1000;
    width: 750px;
    justify-content: flex-end;
  `}
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
`;

const StyledInfo = styled.div`
  height: 100%;
  padding: 5px 10px;
  background: #22222c;
  border-radius: 5px;
  font-size: 14px;
`;

export default Header;
