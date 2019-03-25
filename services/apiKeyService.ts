import * as cryptoJS from 'crypto-js';
import { IStatement } from '../interfaces/IStatement';

export class apiKeyService {

    static create(): string {

        let text: string = "";
        const stringLength: number = 16;
        const possibleChar: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < stringLength; i++) {
            text += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
        }

        return text;

        // return this.encrypt(text);
    }

    static encrypt = (apiKey: string): string => {
        // const secret: string = process.env.ENCRYPT_SECRET;
        let iv = cryptoJS.lib.WordArray.create('MwSyY78X4dbPit1vAKdtZA').words.toString();
        iv = cryptoJS.enc.Base64.parse(iv);
        let secret: string = cryptoJS.lib.WordArray.create('dKjuVDcKxAARFlzUDvVdyr').words.toString();
        secret = cryptoJS.enc.Base64.parse(secret);
        const padding = cryptoJS.pad.Pkcs7;
        const mode = cryptoJS.mode.CBC;
        const options = {
            iv: iv,
            padding: padding,
            mode: mode
        };
        const encryptedText = cryptoJS.AES.encrypt(apiKey, secret, options);
        return encryptedText.toString();
    }

    static decrypt = (cipherText: string): string => {
        // const secret: string = process.env.ENCRYPT_SECRET;
        // const iv: string = process.env.ENCRYPT_IV;
        let iv = cryptoJS.lib.WordArray.create('MwSyY78X4dbPit1vAKdtZA').words.toString();
        iv = cryptoJS.enc.Base64.parse(iv);
        let secret: string = cryptoJS.lib.WordArray.create('dKjuVDcKxAARFlzUDvVdyr').words.toString();
        secret = cryptoJS.enc.Base64.parse(secret);
        const padding = cryptoJS.pad.Pkcs7;
        const mode = cryptoJS.mode.CBC;
        const options = {
            iv: iv,
            padding: padding,
            mode: mode
        };
        const bytes = cryptoJS.AES.decrypt(cipherText, secret, options);
        // console.log(4,  bytes.toString());
        return bytes.toString(cryptoJS.enc.Utf8);
    }

    static generatePolicy = (principalId: string, effect: "Allow" | "Deny" | "Unauthorized", methodArn: string) => {
        const statement = apiKeyService.createStatement(effect, methodArn);
        const policyDocument = apiKeyService.createPolicyDocument(statement)
        const authResponse = apiKeyService.createAuthResponse(principalId, policyDocument);
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

    private static createAuthResponse = (principalId: string, policyDocument) => {
        return {
            principalId: principalId,
            policyDocument: policyDocument
        }
    }

    static getApiId = (methodArn: string): string => {
        const methodParts = methodArn.split(':');
        return methodParts[5].split('/')[3];
    }
}