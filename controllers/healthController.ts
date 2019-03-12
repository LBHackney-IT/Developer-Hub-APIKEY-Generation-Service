import { APIGatewayProxyHandler, DynamoDBStreamHandler, DynamoDBStreamEvent } from 'aws-lambda';
import { elasticSearchService } from '../services/elasticSearchService';
import * as elasticSearch from 'elasticsearch';
import { responseService } from '../services/responseService';
import { dbService } from '../services/dbService';
import { IApi } from '../interfaces/IApi';

export const healthCheck: APIGatewayProxyHandler = async (event, context) => {
    try {
        let response;
        const esService: elasticSearchService = new elasticSearchService();
        await esService.healthCheck()
        .then(() => {
            response = {
                body: {
                    elasticSearch: 'Elastic Search cluster is up'
                }
            }
        })
        .catch((error) => {
            throw new Error('Elastic search cluster is down');
        });

        return responseService.success(response);
    
    } catch(error) {
        return responseService.error(error.message, error.statusCode);
    };
}
