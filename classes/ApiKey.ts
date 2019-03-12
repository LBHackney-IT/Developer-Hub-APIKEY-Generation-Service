import { dbService } from '../services/dbService';
import { ICreateKeyRequest, IReadKeyRequest, IVerifyKeyRequest } from '../interfaces/IRequests';
import { generateID, assignToBody } from '../helper';
import { apiKeyService } from '../services/apiKeyService';
import { AWSError } from 'aws-sdk';
export class ApiKey {
    private DATABASE_ID = 'apiKey';

    /**
     *
     *
     * @memberof ApiKey
     */
    create = async (createKeyRequest: ICreateKeyRequest): Promise<object> => {
        try {
            let response;
            const db: dbService = new dbService(this.DATABASE_ID);
            const item = {
                id: generateID(createKeyRequest.cognitoUsername, createKeyRequest.apiId),
                cognitoUsername: createKeyRequest.cognitoUsername,
                apiID: createKeyRequest.apiId,
                email: createKeyRequest.email,
                apiKey: apiKeyService.create(),
                createdAt: Date.now(),
                verified: false
            };

            await db.putItem(item)
                .then((data) => {
                    response = assignToBody({
                        message: 'Your Key has been created'
                    });
                })
                .catch((error: AWSError) => {
                    throw new Error(error.message)
                });
            return response;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    /**
     *
     *
     * @memberof ApiKey
     */
    readSingle = async (readKeyRequest: IReadKeyRequest) => {
        try {
            let response;
            const db: dbService = new dbService(this.DATABASE_ID);
            const id: string = generateID(readKeyRequest.cognitoUsername, readKeyRequest.apiId);

            await db.getItem(id)
                .then((data) => {
                    console.log(data);
                    response = assignToBody({
                        apiKey: apiKeyService.decrypt(data.Item.apiKey),
                        verified: data.Item.verified
                    });
                })
                .catch((error: AWSError) => {
                    console.log(error);
                    throw new Error(error.message);
                });
            return response;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    readAllUnverified = async () => {
        try {
            let response;
            const db: dbService = new dbService(this.DATABASE_ID);
            await db.getApiKeysForUnVerifiedUsers()
                .then((data) => {
                    const items = data.Items.map((item) => {
                        return {
                            email: item['email'],
                            apiID: item['apiID'],
                            verified: item['verified'],
                            cognitoUsername: item['cognitoUsername']
                        };
                    });
                    response = assignToBody(items);
                })
                .catch((error) => {
                    console.log(error);
                });
            return response;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    verify = async (verifyKeyRequest: IVerifyKeyRequest) => {
        try {
            let response;
            const db: dbService = new dbService(this.DATABASE_ID);
            const id: string = generateID(verifyKeyRequest.cognitoUsername, verifyKeyRequest.apiId);
            await db.verifyKey(id)
                .then((data) => {
                    response = {
                        body: data.Attributes
                    };
                })
                .catch((error) => {
                    throw new Error(error.message);
                });
            return response;
        } catch (error) {
            throw new Error(error.message)
        }

    }

    authorise = async () => {
        try {
        } catch (error) {
            
        }
    }
}