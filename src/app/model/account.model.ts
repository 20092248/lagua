import { Timestamp } from "firebase/firestore";
import { DebitTypeEnum } from "./debitType";

export class Account {
    premium: boolean;
    month: number;
    originalPrice: number;
    price: number;
    startDate: Timestamp;
    endDate: Timestamp;
    percentageReduction: number;
    type: DebitTypeEnum;

    constructor() {
        this.premium = false;
        this.month = 0;
        this.originalPrice = 0;
        this.price = 0;
        this.percentageReduction = 0;
        this.startDate = Timestamp.now();
        this.endDate = Timestamp.now();
        this.type = DebitTypeEnum.ALL;
    }
}
