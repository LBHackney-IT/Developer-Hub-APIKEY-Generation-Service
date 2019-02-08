import { ScheduledHandler, ScheduledEvent, APIGatewayProxyHandler, APIGatewayEvent } from "aws-lambda";
import { elasticSearchService } from '../services/elasticSearchService';
import { responseService } from '../services/responseService';
import Axios from "axios";
import { createPathKey, assignToBody } from '../helper';
import { ISwagger } from '../interfaces/ISwagger';

const endInJsonRegex = '(.json)$';
const SWAGGER_INDEX = process.env.ELASTIC_INDEX_SWAGGER;

export const getSwaggerList: APIGatewayProxyHandler = async (event: APIGatewayEvent, context) => {
    try {
        let response;
        const esService: elasticSearchService = new elasticSearchService();

        await esService.getSwaggerObjects(SWAGGER_INDEX)
        .then((data) => {
            console.log(data);

            response = data.hits.hits;
            response = response.map((item) => {
                return item['_source'];
            });

            response = assignToBody(response);
        })
        .catch((error) => {
            throw new Error(error.message);
        });

        return responseService.success(response);
    } catch (error) {
        return responseService.error(error.message, error.statusCode);
    }
}

export const getSwaggerPath: APIGatewayProxyHandler =  async (event: APIGatewayEvent, context) => {
    try {
        let response;
        const pathParameters = event.pathParameters;
        const apiId = pathParameters.apiId;
        const pathId = pathParameters.pathId;

        if (apiId == null || pathId == null) {
            throw new Error("Request variable is missing");
        }
        const esService: elasticSearchService = new elasticSearchService();

        esService.getItem(apiId, SWAGGER_INDEX)
        .then((data) => {
            response = assignToBody(data._source);
        })
        .catch((error) => {
            throw new Error(error.message)
        });

        return responseService.success(response);
    } catch (error) {
        return responseService.error(error.message, error.statusCode);  
    }
}

// export const periodicallyIndexESWithSwaggerJson: ScheduledHandler = async (event: ScheduledEvent, context) => {
    export const periodicallyIndexESWithSwaggerJson: APIGatewayProxyHandler = async (event, context) => {
        try {

    // Get List of Swagger URLS
    let response;
    const API_INDEX = process.env.ELASTIC_INDEX_API;
    const SWAGGER_INDEX = process.env.ELASTIC_INDEX_SWAGGER;
    const esService: elasticSearchService = new elasticSearchService();
    
    await esService.getSwaggerUrls(API_INDEX)
    .then((data) => {
        response = data.hits.hits;
        response = response.map((item) => {
            return item['_source'];
        });
    })
    .catch((error) => {
        console.log(error);
    });

    // Make Request to Each Swagger URL
    response = await Promise.all(response.map(async (urlObject) => {  
        // Check if swagger url string contains .json
        const regexResult = RegExp(endInJsonRegex).test(urlObject.production.swagger_url)
        let swaggerObject: ISwagger;
        // If swagger url contains .json get the swagger object
        if (regexResult) {
            // Make a get request to each url then make an object(ISwagger)
            await Axios.get(urlObject.production.swagger_url)
            .then((_response) => {
                urlObject.swagger = _response.data;
                swaggerObject = {
                    id: urlObject.id,
                    title: _response.data.info.title,
                    version: _response.data.info.version,
                    description: _response.data.info.description || null,
                    paths: createPathKey(_response.data.paths),
                    last_updated: Date.now()
                };
            }).catch((error) => {
                console.log(error);
            });
            
            return swaggerObject;
         } else {
        // If swagger url contains .json get the swagger object
            return null;
        }
    }));

    response = response.filter((item) => {
        return item !== null;
    });

    // Add Objects To Elastic Search

    response.forEach((item) => {
        esService.index(item, SWAGGER_INDEX)
        .then((data) => {
            // console.log(data)
        })
        .catch((error) => {
            console.log(error.message)
        })
    });

    return responseService.success(response);   
} catch (error) {
    return responseService.error(error.message, error.statusCode);   
} 
};
