import { APIGatewayProxyHandler} from 'aws-lambda';
import { AWSError} from 'aws-sdk';
import { dbService } from '../services/dbService';
import { IApi } from '../interfaces/IApi';
import { responseService } from '../services/responseService';
import { assignToBody } from '../helper';
import { elasticSearchService } from '../services/elasticSearchService';


const DATABASE_ID = 'api';
const API_INDEX = process.env.ELASTIC_INDEX_API

/**
*
*
* @param {*} event
* @param {*} context
* @returns
*/
export const createApi: APIGatewayProxyHandler = async (event, context) => {
    try {
        let response;
        const db: dbService = new dbService(DATABASE_ID);
        const body = JSON.parse(event.body);

        const api: IApi = body;

        if (Object.keys(api).length == 0) {
            throw new Error("Request object is missing");
        }

        await db.putItem(api)
            .then((data) => {
                console.log(data);
                response = assignToBody(data.Attributes);
            })
            .catch((error: AWSError) => {
                throw new Error(error.message);
            });

        return responseService.success(response);

    } catch (error) {
        return responseService.error(error.message, error.statusCode);
    }

}

export const getApi: APIGatewayProxyHandler = async (event, context) => {
    try {
        let response;
        const esService: elasticSearchService = new elasticSearchService();
        const pathParameters = event.pathParameters;
        const apiID: string = pathParameters.id;

        if (apiID == null) {
            throw new Error("Request variable is missing");
        }

        await esService.getItem(apiID, API_INDEX)
        .then((data) => {
            console.log(data._source);
            response = assignToBody(data._source);
        }).catch((error) => {
            throw new Error(error.message);
        });

        return responseService.success(response);
    } catch (error) {

        return responseService.error(error.message, error.statusCode);
    }
}

export const getApiList: APIGatewayProxyHandler = async (event, context) => {
    try {
        let response;
        const db: dbService = new dbService(DATABASE_ID);
        const esService: elasticSearchService = new elasticSearchService();

        await esService.getItems(API_INDEX)
        .then((data) => {
            response = data.hits.hits;
            response = response.map((item) => {
                return item['_source'];
            });
            response = assignToBody(response);
        })
        .catch((error) => {
            throw new Error(error.message);
        });



        // await db.getAllItems()
        //     .then((data) => {
        //         response = assignToBody(data.Items);
        //     })
        //     .catch((error) => {
        //         throw new Error(error.message);
        //     });

        return responseService.success(response);

    } catch (error) {
        return responseService.error(error.message, error.statusCode);

    }
}

export const deleteApi: APIGatewayProxyHandler = async (event, context) => {
    try {
        let response;
        const db: dbService = new dbService(DATABASE_ID);
        const pathParameters = event.pathParameters;
        const apiID: string = pathParameters.id;

        await db.deleteItem(apiID)
            .then((data) => {
                response = assignToBody(data.Item);
            })
            .catch((error) => {
                throw new Error(error.message);
            });

        return responseService.success(response);

    } catch (error) {
        return responseService.error(error.message, error.statusCode);

    }
}

