import { DynamoDB, AWSError} from 'aws-sdk';

export class dbService {
    private dynamoDBDocuClient: DynamoDB.DocumentClient;
    private tableName: string;
    
    /**
     *Creates an instance of dbService.
     * @param {string} controller
     * @memberof dbService
     */
    constructor(tableName: string) {
        
        this.dynamoDBDocuClient = new DynamoDB.DocumentClient();
        switch(tableName){
            case 'apiKey': {
                this.tableName = process.env.APIKEY_DYNAMODB_TABLE;
                break;
            }
            case 'api': {
                this.tableName = process.env.API_DYNAMODB_TABLE;
                break;
            }
            default: {
                this.tableName = process.env.APIKEY_DYNAMODB_TABLE;
                break;
            }
        }
    }

    /**
     *
     *
     * @param {*} id
     * @returns {Promise<any>}
     * @memberof dbService
     */
    async getItem(id) : Promise<any> {
        const params = {
            TableName : this.tableName,
            Key: {
              id: id
            }  
        };
          
        return this.dynamoDBDocuClient.get(params).promise();
    }

    /**
     *
     *
     * @param {*} item
     * @returns {Promise<any>}
     * @memberof dbService
     */
    async putItem(item) : Promise<any> {
        const params = {
            TableName: this.tableName,
            Item : item ,
            ReturnValues: "ALL_NEW" 
        };

        return this.dynamoDBDocuClient.put(params).promise();
    }

    /**
     *
     *
     * @param {*} id
     * @returns {Promise<any>}
     * @memberof dbService
     */
    async deleteItem(id) : Promise<any> {
        const params = {
            TableName : this.tableName,
            Key: {
              id: id
            }  
        };
          
        return this.dynamoDBDocuClient.delete(params).promise();
    }

    /**
     *
     *
     * @returns {Promise <any>}
     * @memberof dbService
     */
    async getAllItems() : Promise <any> {
        const params = {
            TableName: this.tableName
        }

        return this.dynamoDBDocuClient.scan(params).promise();
    }

    /**
     *
     *
     * @param {*} id
     * @returns {Promise<any>}
     * @memberof dbService
     */
    async verifyKey(id) : Promise<any> {
        const params = {
            TableName: this.tableName,
            Key: {
                id: id
            },
            UpdateExpression: "set verified = :v",
            ExpressionAttributeValues: {
                ":v": true
            },
            ReturnValues: "UPDATED_NEW"
        };

        return this.dynamoDBDocuClient.update(params).promise();
    } 

    /**
     *
     *
     * @param {string} apiKey
     * @param {string} apiID
     * @returns {Promise<any>}
     * @memberof dbService
     */
    async checkKey(apiKey: string, apiID: string ) : Promise<any> {
        
        const params = {
            TableName: this.tableName,
            FilterExpression : '#token = :token and #apiID = :apiID',
            ExpressionAttributeNames: {
                "#token": "token",
                "#apiID": "apiID"
            },
            ExpressionAttributeValues: {
                ":token": apiKey,
                ":apiID": apiID 
           }
        };

        return this.dynamoDBDocuClient.scan(params).promise();
    }

    /**
     *
     *
     * @param {string} cognitoUsername
     * @returns {Promise<any>}
     * @memberof dbService
     */
    async getApiKeysForUsername(cognitoUsername: string) : Promise<any> {
        
        const params = {
            TableName: this.tableName,
            FilterExpression: 'cognitoUsername = :cognitoUsername',
            ExpressionAttributeValues: {':cognitoUsername': cognitoUsername}
        }

        return this.dynamoDBDocuClient.scan(params).promise();        
    }

    /**
     *
     *
     * @returns {Promise<any>}
     * @memberof dbService
     */
    async getApiKeysForUnVerifiedUsers() : Promise<any> {
        
        const params = {
            TableName: this.tableName,
            FilterExpression: 'verified = :verified',
            ExpressionAttributeValues: {':verified': false}
        }

        return this.dynamoDBDocuClient.scan(params).promise();        
    }
}