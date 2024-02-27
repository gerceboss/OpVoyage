export interface ITxCountStats {
  timestamp: number;
  chainId: number;
  transactionCount: number;
  totalTransactionCount: number;
}

export const txCountStatsFromResponse = (response: any[]): ITxCountStats => {
  return {
    timestamp: response[0],
    chainId: response[1],
    transactionCount: response[2],
    totalTransactionCount: response[3],
  };
};
