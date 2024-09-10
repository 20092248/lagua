export class Account {
    premium: boolean;
    month: number;
    price: number;
    startDate: Date;
    endDate: Date;
    percentageReduction: number;

    constructor() {
        this.premium = false;
        this.month = 0;
        this.price = 0;
        this.percentageReduction = 0;
        this.startDate = new Date();
        this.endDate = new Date();
    }
}
