import { APIGatewayProxyHandler } from 'aws-lambda';
import { AWSError } from 'aws-sdk';
import { dbService } from '../services/dbService';
import { tokenService } from '../services/tokenService';
import { generateID } from '../helper';
import { I_tokenBody } from '../interfaces';
import { responseService } from '../services/responseService';

export const createToken: APIGatewayProxyHandler = async (event, context) => {
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


export const readToken: APIGatewayProxyHandler = async (event, context) => {
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


export const verifyToken: APIGatewayProxyHandler = async (event, context) => {
  try {
    // check user is admin
    let response;
    const db: dbService = new dbService();
    const body: I_tokenBody = JSON.parse(event.body);
    const cognitoUsername = body.cognito_username;
    const apiID = body.api_id;
    const id = generateID(cognitoUsername, apiID);

    await db.updateVerifiedValue(id)
    .then((data) => {
      console.log(data);
      response = data;
    })
    .catch((error) => {
      console.log(error)
    });

    return responseService.success(response);
  } catch (error) {
    
    return responseService.error(error.message, error.statusCode);
  }
}