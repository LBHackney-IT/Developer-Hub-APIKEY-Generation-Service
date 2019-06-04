import * as cryptoJS from 'crypto-js';
import { IStatement } from '../interfaces/IStatement';

export class apiKeyService {

    /**
     * This is a function to create a random string of 16 characters
     * (The encrypt function has been disabled and requires a spike)
     *
     * @static
     * @returns {string}
     * @memberof apiKeyService
     */
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

    /**
     * This is a function to encrypt the a string using the secret and iv 
     * stored in AWS Paramater store. 
     *
     * @static
     * @memberof apiKeyService
     */
    static encrypt = (apiKey: string): string => {
        const secret: string = process.env.ENCRYPT_SECRET;
        const iv: string = process.env.ENCRYPT_IV;
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

    /**
     *
     * This is a function to decrypt the an encrypted string using the secret and iv 
     * stored in AWS Paramater store. 
     * 
     * @static
     * @memberof apiKeyService
     */
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

    /**
     * This a function to build the policy response for the authoriser
     *
     * @static
     * @memberof apiKeyService
     */
    static generatePolicy = (principalId: string, effect: "Allow" | "Deny" | "Unauthorized", methodArn: string) => {
        const statement = apiKeyService.createStatement(effect, methodArn);
        const policyDocument = apiKeyService.createPolicyDocument(statement)
        const authResponse = apiKeyService.createAuthResponse(principalId, policyDocument);
        return authResponse;
    }

    /**
     * This is a function to build the statement object for the policy
     *
     * @private
     * @static
     * @memberof apiKeyService
     */
    private static createStatement = (effect: string, resource: string): IStatement => {
        return {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource
        };
    }

    /**
     * This is a function to produce the policy document object for the policy
     *
     * @private
     * @static
     * @memberof apiKeyService
     */
    private static createPolicyDocument = (statement: IStatement) => {
        return {
            Version: '2012-10-17',
            Statement: [statement]
        };
    }

    /**
     * This is a function to produce the auth response for the policy
     *
     * @private
     * @static
     * @memberof apiKeyService
     */
    private static createAuthResponse = (principalId: string, policyDocument) => {
        return {
            principalId: principalId,
            policyDocument: policyDocument
        }
    }

    /**
     * This is a function to retrieve the api id (endpoint) from the methodArn
     *
     * @static
     * @memberof apiKeyService
     */
    static getApiId = (methodArn: string): string => {
        const methodParts = methodArn.split(':');
        return methodParts[5].split('/')[3];
    }

    /**
     * This is a function to retrieve the method type from the methodArn
     *
     * @static
     * @memberof apiKeyService
     */
    static getMethod = (methodArn: string) => {
        const methodParts = methodArn.split(':');
        return methodParts[5].split('/')[2];
    }

    /**
     * This function needs to be updated to retrive the stage from
     * the method arn
     *
     * @static
     * @memberof apiKeyService
     */
    static getStage = (methodArn: string) => {
        const methodParts = methodArn.split(':');
        return methodParts[5].split('/')[1];
    }

    
}