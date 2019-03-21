import cryptoJS from 'crypto-js';
import { IStatement } from '../interfaces/IStatement';

export class apiKeyService {
 
    static create(): string {
            
        let text: string = "";
        const stringLength: number = 16;   
        const possibleChar: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              
        for (var i = 0; i < stringLength; i++) {
            text += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
        }
 
        return this.encrypt(text);  
    }

    static encrypt = (apiKey: string) : string => {
        const secret: string = process.env.ENCRYPT_SECRET;
        const encryptedText = cryptoJS.AES.encrypt(apiKey, secret);
        return encryptedText.toString();
    }

    static decrypt = (cipherText: string) : string => {
        const secret: string = process.env.ENCRYPT_SECRET;
        const bytes =  cryptoJS.AES.decrypt(cipherText.toString(), secret);
        return bytes.toString(cryptoJS.enc.Utf8);
    }

    static generatePolicy = (principalId, effect: "Allow" | "Deny" | "Unauthorized", methodArn: string) => {
        let authResponse;
        authResponse.principalId = principalId;

        if (effect && methodArn) {
            const statement = apiKeyService.createStatement(effect, methodArn);
            const policyDocument = apiKeyService.createPolicyDocument(statement)
            authResponse.policyDocument = policyDocument;
        }
        
        // Optional output with custom properties of the String, Number or Boolean type.
        authResponse.context = {
            "stringKey": "stringval",
            "numberKey": 123,
            "booleanKey": true
        };
        return authResponse;
    }

    private static createStatement = (effect: string, resource: string): IStatement => {
        return {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource
        };
    }

    private static createPolicyDocument = (statement: IStatement) => {
        return {
            Version: '2012-10-17',
            Statement: [statement]
        };
    }
}