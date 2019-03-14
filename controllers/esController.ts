import { APIGatewayProxyHandler, DynamoDBStreamHandler, DynamoDBStreamEvent } from 'aws-lambda';
import { responseService } from '../services/responseService';
import { Api } from '../classes/Api';

export const dynamoDBStreamToEs: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent, context) => {
    try {
        const api = new Api();
        await api.automaticallyUpdateStoreFromStream(event);  
        // esService.refresh(index);
    } catch (error) {
        console.log({ message: error.message, code: error.statusCode });
    }
}

export const indexES: APIGatewayProxyHandler = async (event, context) => {
    try {
        const api = new Api();
        const response = await api.manuallyUpdateElasticSearch();
        return responseService.success(response);
    } catch (error) {
        return responseService.error(error.message, error.statusCode);
    };
}
