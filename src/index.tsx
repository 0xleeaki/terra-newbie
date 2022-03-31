import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider';
import Header from 'components/Header';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { screenUp } from 'utils/styles';
import AccountInfo from 'views/AccountInfo';
import CountContract from 'views/CountContract';

function App() {
  return (
    <>
      <Header />
      <StyledContainer>
        <AccountInfo />
        <CountContract />
      </StyledContainer>
    </>
  );
}

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <WalletProvider {...chainOptions}>
      <App />
    </WalletProvider>,
    document.getElementById('root'),
  );
});

const StyledContainer = styled.div`
  padding: 15px 15px;
  max-width: 1280px;
  margin: auto;
  ${screenUp('lg')`
    min-height: calc(100vh - 72px);
    padding: 40px 0 40px 0;
  `}
`;

