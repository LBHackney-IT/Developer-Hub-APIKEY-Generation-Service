import { APIGatewayProxyHandler } from 'aws-lambda';
import { AWSError } from 'aws-sdk';
import { dbService } from '../services/dbService';
import { apiKeyService } from '../services/apiKeyService';
import { generateID } from '../helper';
import { I_tokenBody } from '../interfaces';
import { responseService } from '../services/responseService';

const DATABASE_ID = 'apiKey';

export const createKey: APIGatewayProxyHandler = async (event, context) => {
  try {
    let response;
    const db: dbService = new dbService(DATABASE_ID);
    const body: I_tokenBody = JSON.parse(event.body);
    
    const cognitoUsername: string = body.cognito_username;
    const apiID: string = body.api_id;

    if(apiID == null || cognitoUsername == null) {
      throw new Error("Request variables are missing");
    }
    
    const item = {
      id: generateID(cognitoUsername, apiID),
      cognitoUsername: cognitoUsername,
      apiID: apiID,
      apiKey: apiKeyService.create(),
      createdAt: Date.now(),
      verified: false
    };

    await db.putItem(item)
    .then((data) => {
      response = {
        body: {
          apiKey: apiKeyService.decrypt(data.Attributes.apiKey)
        }
      }
    })
    .catch((error: AWSError)=> {
      throw new Error(error.message)
    });

    return responseService.success(response);

  } catch(error) {
    
    return responseService.error(error.message, error.statusCode);
  }
  
};

export const readKey: APIGatewayProxyHandler = async (event, context) => {
  try {
    let response;  
    const db: dbService = new dbService(DATABASE_ID);
    const body = event.queryStringParameters;
    const cognitoUsername: string = body.cognito_username;
    const apiID: string = body.api_id;
    
    if(apiID == null || cognitoUsername == null) {
      throw new Error("Request variables are missing");
    }

    const id: string = generateID(body.cognito_username, body.api_id);

    await db.getItem(id)
    .then((data) => {
      console.log(data);
      response = {
        body: {
          apiKey: apiKeyService.decrypt(data.Item.apiKey),
          verified: data.Item.verified
        }
      }
    })
    .catch((error: AWSError) => {
      console.log(error);
      throw new Error(error.message);
    });

    return responseService.success(response);
  } catch (error) {
      
    return responseService.error(error.message, error.statusCode);
  }  
};

export const readKeysForUser: APIGatewayProxyHandler = async (event, context) => {
  try {
    let response;
    const db: dbService = new dbService(DATABASE_ID);

    const pathParameters = event.pathParameters;
    const cognitoUsername: string = pathParameters.cognito_username;

    if(cognitoUsername == null) {
      throw new Error("Request variable is missing");
    }

    await db.getApiKeys(cognitoUsername)
    .then((data) => {
      console.log(response);
      response = data.Items;
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error.message);
    });

    return responseService.success(response);

  } catch (error) {
    return responseService.error(error.message, error.statusCode);
    
  }
}



export const verifyKey: APIGatewayProxyHandler = async (event, context) => {
  try {
    // check user is admin
    let response;
    const db: dbService = new dbService(DATABASE_ID);
    const body: I_tokenBody = JSON.parse(event.body);
    const cognitoUsername = body.cognito_username;
    const apiID = body.api_id;

    if(apiID == null || cognitoUsername == null) {
      throw new Error("Request variables are missing");
    }

    const id = generateID(cognitoUsername, apiID);

    await db.verifyKey(id)
    .then((data) => {
      response = {
        body: data.Attributes
      };
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error.message);
    });

    return responseService.success(response);
  } catch (error) {
    
    return responseService.error(error.message, error.statusCode);
  }
}

export const authoriseKey: APIGatewayProxyHandler = async (event, context) => {

  try {
    // Get ApiKey + API_ID
    let response;
    const body = JSON.parse(event.body);
    const apiKey = body.api_key;
    const apiID = body.api_id;

    if(apiID == null || apiKey == null) {
      throw new Error("Request variables are missing");
    }

    const db: dbService = new dbService('apiKey');

    // Check if API Key and API_Key exists within DB
    await db.checkKey(apiKey, apiID)
    .then((data) => {
      console.log(data);
      response = data.Items[0];
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error.message);      
    });

    return responseService.success(response);

  } catch (error) {

    return responseService.error(error.message, error.statusCode);  
  }

}