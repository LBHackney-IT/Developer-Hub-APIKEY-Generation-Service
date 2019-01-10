export const generateID = (cognitoUsername: string, apiID: string): string => {
    return cognitoUsername + '_' + apiID;
}