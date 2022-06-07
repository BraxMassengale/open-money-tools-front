export interface Transaction {
  id?: number;
  assetReceived: String;
  assetTaken: String;
  amountReceived: number;
  amountTaken: number;
  transactionTime: number;
  portfolioId: number;
}

