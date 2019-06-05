import { ScheduledHandler, ScheduledEvent, APIGatewayProxyHandler, APIGatewayEvent } from "aws-lambda";
import { elasticSearchService } from '../services/elasticSearchService';
import { responseService } from '../services/responseService';
import Axios from "axios";
import { createPathKey, assignToBody } from '../helper';
import { ISwagger } from '../interfaces/ISwagger';
import { swaggerFiles } from '../swagger-store';
import { Swagger } from '../classes/Swagger';

const endInJsonRegex = '(.json)$';
const SWAGGER_INDEX = process.env.ELASTIC_INDEX_SWAGGER;

export const getSwaggerList: APIGatewayProxyHandler = async (event: APIGatewayEvent, context) => {
    try {
        const swagger: Swagger = new Swagger();
        const response = await swagger.readAll();

        return responseService.success(response);
    } catch (error) {
        return responseService.error(error.message, error.statusCode);
    }
}

export const getSwaggerPath: APIGatewayProxyHandler = async (event: APIGatewayEvent, context) => {
    try {
        const pathParameters = event.pathParameters;
        const queryParameters = event.queryStringParameters;
        const apiId = pathParameters.apiId;
        const pathId = queryParameters.pathId;
        if (apiId == null || pathId == null) {
            throw new Error("Request variable is missing");
        }
        const swagger: Swagger = new Swagger();
        const response = await swagger.readSingle(apiId, pathId)
        return responseService.success(response);
    } catch (error) {
        return responseService.error(error.message, error.statusCode);
    }
}

export const periodicallyIndexESWithSwaggerJson: ScheduledHandler = async (event: ScheduledEvent, context) => {
    try {
        // Get List of Swagger URLS
        const swagger: Swagger = new Swagger();
        await swagger.indexESWithSwaggerJson();
    } catch (error) {
        console.log(error);
    }
};
