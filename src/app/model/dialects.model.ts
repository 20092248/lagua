import { Dialect } from "./dialect.model";

export class Dialects {
    shingazidja: Dialect;
    shindzuani: Dialect;
    shimwali: Dialect;
    shimaore: Dialect;

    constructor() {
        this.shingazidja = {} as Dialect;
        this.shindzuani = {} as Dialect;
        this.shimwali = {} as Dialect;
        this.shimaore = {} as Dialect;
    }
}
