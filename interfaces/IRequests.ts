export interface ICreateKeyRequest {
    cognitoUsername: string;
    apiId: string;
    email: string;
}

export interface IReadKeyRequest {
    cognitoUsername: string;
    apiId: string;
}

export interface IVerifyKeyRequest {
    cognitoUsername: string;
    apiId: string;
}