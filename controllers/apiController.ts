import { APIGatewayProxyHandler } from 'aws-lambda';
import { AWSError } from 'aws-sdk';
import { dbService } from '../services/dbService';
import { IApi } from '../interfaces/IApi';
import { responseService } from '../services/responseService';
import { generateID } from '../helper';

export const createApi: APIGatewayProxyHandler = async (event, context) => {
    try {
        let response;
        const db: dbService = new dbService('api');
        const body = JSON.parse(event.body);
    
        const api: IApi = body.api;
    
        if(Object.keys(api).length == 0) {
            throw new Error("Request object is missing");
        }
    
        await db.putItem(api)
        .then((data) => {
            response = "Your api has been posted";
        })
        .catch((error: AWSError) => {
            throw new Error(error.message);
        });

        return responseService.success(response);

    } catch(error) {      
        return responseService.error(error.message, error.statusCode);
    }

}

export const getApi: APIGatewayProxyHandler = async (event, context) => {
    try {
        let response;  
        const db: dbService = new dbService('apiKey');
        const body = event.queryStringParameters;
        const apiID: string = body.api_id;
        
        if(apiID == null) {
          throw new Error("Request variable is missing");
        }
    
        const id: string = generateID(body.cognito_username, body.api_id);
    
        await db.getItem(id)
        .then((data) => {
          response = data.Item;
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

// export const getApis: APIGatewayProxyHandler = async (event, context) => {
//     try {
        
//     }
// }