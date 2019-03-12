import { APIGatewayProxyHandler, CustomAuthorizerHandler, CustomAuthorizerEvent } from 'aws-lambda';
import { AWSError } from 'aws-sdk';
import { dbService } from '../services/dbService';
import { apiKeyService } from '../services/apiKeyService';
import { generateID, assignToBody, allKeysHaveValues } from '../helper';
import { responseService } from '../services/responseService';
import { IApi } from '../interfaces/IApi';
import { ICreateKeyRequest, IReadKeyRequest, IVerifyKeyRequest } from '../interfaces/IRequests';
import { ApiKey } from '../classes/ApiKey';

const DATABASE_ID = 'apiKey';

export const createKey: APIGatewayProxyHandler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const createKeyRequest: ICreateKeyRequest = {
      cognitoUsername: body.cognito_username,
      apiId: body.api_id,
      email: body.email
    }
    if(!allKeysHaveValues(createKeyRequest)) {
      throw new Error('Request variable is missing');
    }
    const apiKey: ApiKey = new ApiKey();
    const response = await apiKey.create(createKeyRequest);
    return responseService.success(response);
  } catch(error) {
    return responseService.error(error.message, error.statusCode);
  }
};

export const readKey: APIGatewayProxyHandler = async (event, context) => {
  try {  
    const body = event.queryStringParameters;
    const readKeyRequest: IReadKeyRequest = {
      cognitoUsername: body.cognito_username,
      apiId: body.api_id
    }
    if(!allKeysHaveValues(readKeyRequest)) {
      throw new Error('Request variable is missing');
    }
    const apiKey: ApiKey = new ApiKey();
    const response = apiKey.readSingle(readKeyRequest);
    return responseService.success(response);
  } catch (error) {
      
    return responseService.error(error.message, error.statusCode);
  }  
};

export const readKeysForUser: APIGatewayProxyHandler = async (event, context) => {
  try {
    let _response: object[];
    const db: dbService = new dbService(DATABASE_ID);

    const pathParameters = event.pathParameters;
    const cognitoUsername: string = pathParameters.cognito_username;

    if(cognitoUsername == null) {
      throw new Error("Request variable is missing");
    }

    await db.getApiKeysForUsername(cognitoUsername)
    .then((data)  =>  {
      _response = data.Items;
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error.message);
    });

    _response = await Promise.all(_response.map(async (item) => {
      let api: IApi;
      const apiDB: dbService = new dbService("api");
      await apiDB.getItem(item['apiID'])
      .then((data) => {
        api = data.Item;
      })
      .catch((error) => {
        throw new Error(error.message);
      })
    
    return {
        api: api,
        apiKey: apiKeyService.decrypt(item['apiKey']),
        verified: item['verified']
      }
    }));

    const response = assignToBody(_response);

    return responseService.success(response);

  } catch (error) {
    return responseService.error(error.message, error.statusCode);
    
  }
}

export const readAllUnVerifiedKeys: APIGatewayProxyHandler = async (event, context) => {

  try {
    const apiKey: ApiKey = new ApiKey();
    const response = await apiKey.readAllUnverified();
    return responseService.success(response);
  } catch (error) {
    return responseService.error(error.message , error.statusCode);
  }
}

export const verifyKey: APIGatewayProxyHandler = async (event, context) => {
  try {
    // check user is admin
    const body = JSON.parse(event.body);

    const verifyKeyRequest: IVerifyKeyRequest = {
      cognitoUsername: body.cognito_username,
      apiId: body.api_id
    }

    if(!allKeysHaveValues(verifyKeyRequest)) {
      throw new Error('Request variable is missing');
    }
    const apiKey: ApiKey = new ApiKey();
    const response = apiKey.verify(verifyKeyRequest);

    return responseService.success(response);
  } catch (error) {
    
    return responseService.error(error.message, error.statusCode);
  }
}

// export const authoriseKey: CustomAuthorizerHandler = async (event: CustomAuthorizerEvent, context) => {

//   try {
//     const token = event.authorizationToken;
//     const pathParamters = event.pathParameters;
//     const methodArn = event.methodArn
//     // Get ApiKey + API_ID
//     let response;
//     // const body = JSON.parse(event.body);
//     // const apiKey = body.api_key;
//     // const apiID = body.api_id;

//     // if(apiID == null || apiKey == null) {
//     //   throw new Error("Request variables are missing");
//     // }

//     // const db: dbService = new dbService('apiKey');

//     // // Check if API Key and API_Key exists within DB
//     // await db.checkKey(apiKey, apiID)
//     // .then((data) => {
//     //   console.log(data);
//     //   response = assignToBody(true);
//     // })
//     // .catch((error) => {
//     //   console.log(error);
//     //   throw new Error(error.message);      
//     // });

//     return responseService.success(response);

//   } catch (error) {

//     const response = assignToBody(false);

//     return responseService.success(response);

//     return responseService.error(error.message, error.statusCode);  
//   }

// }