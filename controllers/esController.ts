import { APIGatewayProxyHandler, DynamoDBStreamHandler, DynamoDBStreamEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { dbService } from '../services/dbService';
import { IApi } from '../interfaces/IApi';
import { responseService } from '../services/responseService';
import { elasticSearchService } from '../services/elasticSearchService';

export const dynamoDBStreamToEs: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent, context) => {
    try {
        // Instantiate AWS.DynamoDB.Unmarshall converter
        const convert = DynamoDB.Converter.unmarshall;
        // Instantiate Elastic Search Service
        const esService: elasticSearchService = new elasticSearchService();
        // Get Elastic search index
        let index: string = process.env.ELASTIC_INDEX_API;

        // Loop through each record
        event.Records.forEach(async (record) => {
            // Check the eventName for each record and perform action
            switch (record.eventName) {
                // Index new object when created in DynamoDB
                case 'INSERT': {
                    // Convert from AWS Object to JS Object
                    const newObject = convert(record.dynamodb.NewImage);
                    await esService.index(newObject, index)
                        .then((data) => {
                            console.log('success', data);
                        }).catch((error) => {
                            throw new Error(error.message)
                        });
                    break;
                }
                // Index object when modified in DynamoDB                
                case 'MODIFY': {
                    const newObject = convert(record.dynamodb.NewImage);
                    await esService.index(newObject, index)
                        .then((data) => {
                            console.log(data);
                        }).catch((error) => {
                            throw new Error(error.message)
                        });
                    break;
                }
                // delete object from index when removed in DynamoDB                
                case 'REMOVE': {
                    const newObject = convert(record.dynamodb.NewImage);
                    await esService.delete(newObject, index)
                        .then((data) => {
                            console.log(data);
                        }).catch((error) => {
                            throw new Error(error.message)
                        });
                    break;
                }
            }
        });

        esService.refresh(index);


    } catch (error) {
        console.log({ message: error.message, code: error.statusCode });
    }

}

export const indexES: APIGatewayProxyHandler = async (event, context) => {
    try {
        const DATABASE_ID = 'api';
        let listOfApis: IApi[];
        let response;
        const esService: elasticSearchService = new elasticSearchService();
        const db: dbService = new dbService(DATABASE_ID);
        await db.getAllItems()
            .then((data) => {
                listOfApis = data.Items
            })
            .catch((error) => {
                throw new Error(error.message);
            });

        listOfApis.forEach(async (api) => {
            await esService.index(api, process.env.ELASTIC_INDEX_API)
                .then(() => {
                    response = {
                        [api.id]: 'successful'
                    }
                })
                .catch((error) => {
                    throw new Error('Elastic search cluster is down');
                });
        });

        return responseService.success(response);

    } catch (error) {
        return responseService.error(error.message, error.statusCode);
    };
}
