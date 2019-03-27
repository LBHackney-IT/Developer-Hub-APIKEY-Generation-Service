import { DynamoDB, AWSError } from 'aws-sdk';
import { resolve } from 'dns';

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
        switch (tableName) {
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
     * This is a function to get a single item from database
     *
     * @param {*} id
     * @returns {Promise<any>}
     * @memberof dbService
     */
    async getItem(id: string): Promise<any> {
        const params = {
            TableName: this.tableName,
            Key: {
                id: id
            }
        };

        return this.dynamoDBDocuClient.get(params).promise();
    }

    /**
     * This is a function to put a single item into a database
     *
     * @param {*} item
     * @returns {Promise<any>}
     * @memberof dbService
     */
    async putItem(item): Promise<any> {
        const params = {
            TableName: this.tableName,
            Item: item
        };

        return this.dynamoDBDocuClient.put(params).promise();
    }

    /**
     * This is a function to delete an item from the table
     *
     * @param {*} id
     * @returns {Promise<any>}
     * @memberof dbService
     */
    async deleteItem(id: string): Promise<any> {
        const params = {
            TableName: this.tableName,
            Key: {
                id: id
            }
        };

        return this.dynamoDBDocuClient.delete(params).promise();
    }

    /**
     * This is a function to get all items from a table
     *
     * @returns {Promise <any>}
     * @memberof dbService
     */
    async getAllItems(): Promise<any> {
        const params = {
            TableName: this.tableName
        }

        return this.dynamoDBDocuClient.scan(params).promise();
    }

    /**
     * This is a function to update the verified field to true
     *
     * @param {*} id
     * @returns {Promise<any>}
     * @memberof dbService
     */
    async verifyKey(id): Promise<any> {
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

    async update(id: string, expression: object) : Promise<any> {
        const updateExpression: string = this.generateUpdateExpression(Object.keys(expression));
        const expressionAttributeValues = this.generateExpressionAttributeValues(expression);
        const params = {
            TableName: this.tableName,
            Key: {
                id: id
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "UPDATED_NEW"
        };

        return this.dynamoDBDocuClient.update(params).promise();

    }

    async scan(expression: object): Promise<any> {
        const filterExpression: string = this.generateFilterExpression(Object.keys(expression));
        const expressionAttributeValues = this.generateExpressionAttributeValues(expression);
        const params = {
            TableName: this.tableName,
            FilterExpression: filterExpression,
            ExpressionAttributeValues: expressionAttributeValues
        }

        return this.dynamoDBDocuClient.scan(params).promise();
    }

    private generateFilterExpression = (items: string[]): string => {
        let response: string = '';
        items.forEach((item, index) => {
            response += `${item} = :${item}`;
            if (index !== items.length - 1) {
                response += ' and ';
            }
        });
        return response;
    }

    private generateUpdateExpression = (items: string[]): string => {
        let response: string = '';
        items.forEach((item, index) => {
            if(index === 0) {
                response += 'SET ';
            }
            response += `${item} = :${item}`;

            if (index !== items.length - 1) {
                response += ','
            }
        }); 

        return response;
    }

    // private generateExpressionAttributeValues = () => {

    // }

    private generateExpressionAttributeValues = (items: object): object => {
        let response: {[key: string]: any} = {}; 
        Object.keys(items).map((item) => {
            response[`:${item}`] = items[item];
        });
        return response
    }
}