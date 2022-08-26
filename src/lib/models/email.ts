export class Email{
    constructor(data: any){
        this.emailAddress = data.emailAddress || null;
        this.subject = data.subject || null;
        this.message = data.message || null;
    }
    emailAddress: string;
    subject: string;
    message: string;
}