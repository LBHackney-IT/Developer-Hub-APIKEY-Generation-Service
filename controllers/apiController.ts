import { APIGatewayProxyHandler} from 'aws-lambda';
import { AWSError} from 'aws-sdk';
import { dbService } from '../services/dbService';
import { IApi } from '../interfaces/IApi';
import { responseService } from '../services/responseService';


const DATABASE_ID = 'api';

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
                response = {
                    body: data.Attributes
                };
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
        const db: dbService = new dbService(DATABASE_ID);
        const pathParameters = event.pathParameters;
        const apiID: string = pathParameters.id;

        if (apiID == null) {
            throw new Error("Request variable is missing");
        }

        await db.getItem(apiID)
            .then((data) => {
                response = {
                    body: data.Item
                };
            })
            .catch((error: AWSError) => {
                console.log(error);
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

        await db.getAllItems()
            .then((data) => {
                response = {
                    body: data.Items
                }
            })
            .catch((error) => {
                throw new Error(error.message);
            });

        return responseService.success(response);

    } catch (error) {
        return responseService.error(error.message, error.statusCode);

    }
}

