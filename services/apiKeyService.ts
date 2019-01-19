import cryptoJS from 'crypto-js';

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
}