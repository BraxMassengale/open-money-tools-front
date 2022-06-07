import {Transaction} from "./transaction";
import {Portfolio} from "./portfolio";
import {Holding} from "./holding";

export interface CustomResponse {
  timestamp: Date;
  statusCode: number;
  status: String;
  reason: String;
  message: String;
  developerMessage: String;
  data: { transactions: Transaction[], transaction?: Transaction, portfolio?: Portfolio, holdings?: Holding[], holding?: Holding };
}
