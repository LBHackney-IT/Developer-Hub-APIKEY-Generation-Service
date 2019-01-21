import { DynamoDB, AWSError} from 'aws-sdk';

export class dbService {
    private dynamoDBDocuClient: DynamoDB.DocumentClient;
    private tableName: string;
    
    constructor(controller: string) {
        this.dynamoDBDocuClient = new DynamoDB.DocumentClient();
        switch(controller){
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

    async putItem(item) : Promise<any> {
        const params = {
            TableName: this.tableName,
            Item : item ,
            ReturnValues: "ALL_OLD" 
        };

        return this.dynamoDBDocuClient.put(params).promise();
    }

    async getItem(id) : Promise<any> {
        const params = {
            TableName : this.tableName,
            Key: {
              id: id
            }  
        };
          
        return this.dynamoDBDocuClient.get(params).promise();
    }

    async getAllItems() : Promise <any> {
        const params = {
            TableName: this.tableName
        }

        return this.dynamoDBDocuClient.scan(params).promise();
    }

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

    async getApiKeys(cognitoUsername: string) : Promise<any> {
        const params = {
            TableName: this.tableName,
            FilterExpressions: '#cognitoUsername = ' + cognitoUsername
        }

        return this.dynamoDBDocuClient.scan(params).promise();        
    }
}