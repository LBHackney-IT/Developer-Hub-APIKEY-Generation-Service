import { APIGatewayProxyHandler } from 'aws-lambda';
import { AWSError } from 'aws-sdk';
import { dbService } from '../services/dbService';
import { tokenService } from '../services/tokenService';
import { generateID } from '../helper';
import { I_tokenBody } from '../interfaces';
import { responseService } from '../services/responseService';
import { authService } from '../services/authService';

export const createKey: APIGatewayProxyHandler = async (event, context) => {
  try {
    
    let response;
    const db: dbService = new dbService();
    const body: I_tokenBody = JSON.parse(event.body);
    
    const cognitoUsername = body.cognito_username;
    const apiID = body.api_id;
    
    const item = {
      id: generateID(cognitoUsername, apiID),
      cognitoUsername: cognitoUsername,
      apiID: apiID,
      token: tokenService.create(),
      createdAt: Date.now(),
      verified: false
    };

    await db.putItem(item)
    .then((data) => {
      response = data;
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
    const db: dbService = new dbService();
    const body = event.queryStringParameters;
    // add if check to see if it has cognito username and api_id
    const cognitoUsername: string = body.cognito_username;
    const apiID: string = body.api_id;
    const id: string = generateID(body.cognito_username, body.api_id);

    await db.getItem(id)
    .then((data) => {
      response = data.Item;
    })
    .catch((error: AWSError) => {
      throw new Error(error.message);
    });

    return responseService.success(response);
  } catch (error) {
      
    return responseService.error(error.message, error.statusCode);
  }  
};

export const verifyKey: APIGatewayProxyHandler = async (event, context) => {
  try {
    // check user is admin
    let response;
    const db: dbService = new dbService();
    const body: I_tokenBody = JSON.parse(event.body);
    const cognitoUsername = body.cognito_username;
    const apiID = body.api_id;
    const id = generateID(cognitoUsername, apiID);

    await db.verifyKey(id)
    .then((data) => {
      console.log(data);
      response = data;
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
    const apiKey = "O7xGzeS78RrOe21a";
    const apiID = "income_collection";
    const db: dbService = new dbService();

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