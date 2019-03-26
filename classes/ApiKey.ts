import { dbService } from '../services/dbService';
import { ICreateKeyRequest, IReadKeyRequest, IVerifyKeyRequest } from '../interfaces/IRequests';
import { generateID, assignToBody } from '../helper';
import { apiKeyService } from '../services/apiKeyService';
import { AWSError } from 'aws-sdk';
import { IApi } from '../interfaces/IApi';
import { responseService } from '../services/responseService';
import { IKey } from '../interfaces/IKey';
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
                verified: false, 
                last_accessed: Date.now()
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
                    response = assignToBody({
                        apiKey: data.Item.apiKey,
                        verified: data.Item.verified
                    });
                })
                .catch((error: AWSError) => {
                    throw new Error(error.message);
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
    readAllForUser = async (cognitoUsername: string) => {
        try {
            let _response;
            const db: dbService = new dbService(this.DATABASE_ID);
            const params = {
                cognitoUsername: cognitoUsername
            };
            await db.scan(params)
                .then((data) => {
                    _response = data.Items;
                })
                .catch((error) => {
                    console.log(error);
                    throw new Error(error.message);
                });

            _response = await Promise.all(_response.map(async (item) => {
                let api: IApi;
                const apiDB: dbService = new dbService("api");
                await apiDB.getItem(item['apiID'])
                    .then((data) => {
                        api = data.Item;
                    })
                    .catch((error) => {
                        throw new Error(error.message);
                    })

                if (api) {
                    return {
                        api: api,
                        apiKey: item['apiKey'],
                        verified: item['verified']
                    }
                } else {
                    return null;
                }
            }));

            _response = _response.filter((item) => {
                return item !== null;
            });

            return responseService.success(_response);
        } catch (error) {
            return responseService.error(error.message, error.statusCode);
        }
    }

    /**
     *
     *
     * @memberof ApiKey
     */
    readAllUnverified = async () => {
        try {
            let response;
            const db: dbService = new dbService(this.DATABASE_ID);
            const params = {
                verified: false
            };
            await db.scan(params)
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

    /**
     *
     *
     * @memberof ApiKey
     */
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

    authorise = async (apiKey: string, apiId: string, methodArn: string) => {
        try {
            let policy;
            const key: IKey = await this.getKey(apiKey, apiId);
            if (key.verified) {
                policy = apiKeyService.generatePolicy(key.cognitoUsername, "Allow", methodArn)
            } else {
                policy = apiKeyService.generatePolicy(key.cognitoUsername, "Deny", methodArn)
            }
            return policy;
        } catch (error) {
            return apiKeyService.generatePolicy('user', "Deny", methodArn)
        }
    }

    private getKey = async (apiKey: string, apiId: string): Promise<IKey> => {
        try {
            let response: IKey;
            const db: dbService = new dbService(this.DATABASE_ID);
            await db.checkKey(apiKey, apiId).then((data) => {
                response = data.Items[0];
            }).catch((error) => {
                throw new Error(error.message);
            });
            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}