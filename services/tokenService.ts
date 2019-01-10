export class tokenService {
 
    static create(): string {
            
        let text: string = "";
        const stringLength: number = 16;   
        const possibleChar: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              
        for (var i = 0; i < stringLength; i++) {
            text += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
        }
            
        return text;  
    }
}