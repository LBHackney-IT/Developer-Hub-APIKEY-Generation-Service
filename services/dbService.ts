import { DynamoDB, AWSError} from 'aws-sdk';

export class dbService {
    private dynamoDBDocuClient: DynamoDB.DocumentClient;
    private tableName: string;
    
    constructor() {
        this.dynamoDBDocuClient = new DynamoDB.DocumentClient();
        this.tableName = process.env.DYNAMODB_TABLE;
    }

    async putItem(item) : Promise<any> {
        const params = {
            TableName: this.tableName,
            Item : item  
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

    async updateVerifiedValue(id) : Promise<any> {
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
}