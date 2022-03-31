import styled from 'styled-components';

export type Size = 'sm' | 'md' | 'lg';

const Heights: Record<Size, number> = {
  sm: 24,
  md: 32,
  lg: 40,
};

const BorderRadius = {
  sm: '6px',
  md: '8px',
  lg: '10px',
};

const FontSize = {
  sm: '12px',
  md: '14px',
  lg: '16px',
};

const FontWeight = {
  sm: 'bold',
  md: 'bold',
  lg: 'bold',
};

export const Button = styled.button<{
  error?: boolean;
  size?: Size;
  block?: boolean;
  loadingSubmit?: boolean;
}>`
  padding: 0 18px;
  font-size: ${(p) => FontSize[p.size || 'lg']};
  border-radius: ${(p) => BorderRadius[p.size || 'lg']};
  font-weight: ${(p) => FontWeight[p.size || 'lg']};
  color: #fff;
  line-height: 1;
  display: ${(p) => (p.block ? 'flex' : 'inline-flex')};
  align-items: center;
  justify-content: center;
  height: ${(p) => Heights[p.size || 'lg']}px;
  width: ${(p) => (p.block ? '100%' : '')};
  background-color: #5973fe;
  cursor: pointer;
  i,
  img {
    margin-right: 8px;
    margin-bottom: 1px;
  }
  :not(:disabled) {
    :hover {
      background-color: #627fff;
    }
  }
  :disabled {
    pointer-events: none;
    background-color: #232336;
    color: ${({ error }) => (error ? '#d94a4c' : '#a7a6b8')};
  }
  &:after {
    content: ' ';
    text-align: left;
    width: 1rem;
    animation: dots 1.4s linear infinite;
    display: ${(p) => (p.loadingSubmit ? 'inline-block' : 'none')};
  }
`;
