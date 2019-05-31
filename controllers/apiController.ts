import { APIGatewayProxyHandler } from 'aws-lambda';
import { IApi } from '../interfaces/IApi';
import { responseService } from '../services/responseService';
import { Api } from '../classes/Api';
import { dbService } from '../services/dbService';

/**
*
*
* @param {*} event
* @param {*} context
* @returns
*/
export const createApi: APIGatewayProxyHandler = async (event, context) => {
    try {
        const body = JSON.parse(event.body);
        const api: IApi = body;
        if(!api.id) {
            api.id = api.title.replace(' ', '_').toLowerCase();
        }
        if (Object.keys(api).length == 0) {
            throw new Error("Request object is missing");
        }
        const apiClass: Api = new Api();
        const response = await apiClass.create(api);
        return responseService.success(response);
    } catch (error) {
        return responseService.error(error.message, error.statusCode);
    }

}

export const getApi: APIGatewayProxyHandler = async (event, context) => {
    try {
        const id: string = event.pathParameters.id;
        if (id == null) {
            throw new Error("Request variable is missing");
        }
        const api: Api = new Api();
        const response = await api.readSingle(id);
        return responseService.success(response);
    } catch (error) {

        return responseService.error(error.message, error.statusCode);
    }
}

export const getApiList: APIGatewayProxyHandler = async (event, context) => {
    try {
        const api: Api = new Api();
        const response = await api.readAll();
        return responseService.success(response);
    } catch (error) {
        return responseService.error(error.message, error.statusCode);
    }
}

export const deleteApi: APIGatewayProxyHandler = async (event, context) => {
    try {
        const id: string = event.pathParameters.id;
        if (id == null) {
            throw new Error("Request variable is missing");
        }
        const api: Api = new Api();
        const response = await api.delete(id);

        return responseService.success(response);

    } catch (error) {
        return responseService.error(error.message, error.statusCode);

    }
}

export const migrateApi: APIGatewayProxyHandler = async (event, context) => {
    try {
        const db: dbService = new dbService('apiStore');
        let response: IApi[];
        db.getAllItems().then((data) => {
            response = data;
        });

        return responseService.success(response);
    } catch (error) {
        return responseService.error(error.message, error.statusCode);        
    }
}

