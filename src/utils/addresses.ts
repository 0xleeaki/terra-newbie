export const shortenAddress = (address: string) => {
  if (address && address.length > 0) {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 10,
      address.length,
    )}`;
  }
};
