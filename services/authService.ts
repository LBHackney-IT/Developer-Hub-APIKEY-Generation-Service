import { CognitoIdentity, CognitoIdentityServiceProvider } from "aws-sdk";

export class authService {
    cognitoIdentity: CognitoIdentity = new CognitoIdentity;

    cognitoUsername: string;
    
    constructor(cognitoUsername: string){
        this.cognitoUsername = cognitoUsername;
    }

    isUserValid(): boolean {
        // Check if user is valid
        return true;
    }

    getUserId(): string {
        
        // Get user Id from Cognito
        return "";
    }


}