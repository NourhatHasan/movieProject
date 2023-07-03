export interface CheckOut {
    token: "string",
    cardholderName: "string",
    cardNumber: "string",
    expiryMonth: "string",
    expiryYear: "string",
    cvv: "string"
}export class CheckOutForm {
    token: string = "tok_visa";
    cardholderName: string = "";
    cardNumber: string = "";
    expiryMonth: string = "";
    expiryYear: string = "";
    cvv: string = "";

    constructor(checkOut?: CheckOutForm) {
        if (checkOut) {
            this.token = checkOut.token;
            this.cardholderName = checkOut.cardholderName;
            this.cardNumber = checkOut.cardNumber;
            this.cvv = checkOut.cvv;
            this.expiryMonth = checkOut.expiryMonth;
            this.expiryYear = checkOut.expiryYear;
        }
    }

   static getInitialValues(): CheckOutForm {
        return {
            token: "tok_visa",
            cardholderName: "",
            cardNumber: "",
            expiryMonth: "",
            expiryYear: "",
            cvv: "",
        };
    }
}