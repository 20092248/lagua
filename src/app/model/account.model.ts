import { DebitTypeEnum } from "./debitType";

export class Account {
    premium: boolean;
    month: number;
    originalPrice: number;
    price: number;
    startDate: Date;
    endDate: Date;
    percentageReduction: number;
    type: DebitTypeEnum;

    constructor() {
        this.premium = false;
        this.month = 0;
        this.originalPrice = 0;
        this.price = 0;
        this.percentageReduction = 0;
        this.startDate = new Date();
        this.endDate = new Date();
        this.type = DebitTypeEnum.ONCE;
    }
}
