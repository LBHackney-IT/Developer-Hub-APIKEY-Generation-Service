import { SES } from "aws-sdk";

export class mailService {
    private ses: SES;

    constructor() {
        this.ses = new SES({apiVersion: '2010-12-01'});
    }

    async sendEmail() : Promise<any> {
        const params = {
            Destination: {
                CcAddresses: [

                ],
                ToAddresses: [

                ]
            },
            Source: "",
            
        };

    }
}