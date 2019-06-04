export interface ICreateKeyRequest {
    cognitoUsername: string;
    apiId: string;
    email: string;
    stage: string;
}

export interface IReadKeyRequest {
    cognitoUsername: string;
    apiId: string;
    stage: string;
}

export interface IVerifyKeyRequest {
    cognitoUsername: string;
    apiId: string;
    stage: string;
}

export interface IAuthoriseKeyRequest {
    apiKey: string;
    methodArn: string;
    apiId: string;
    stage: string;
}