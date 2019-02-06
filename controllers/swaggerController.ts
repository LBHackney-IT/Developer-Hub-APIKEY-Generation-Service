import { ScheduledHandler, ScheduledEvent,APIGatewayProxyHandler } from "aws-lambda";
import { elasticSearchService } from '../services/elasticSearchService';
import { responseService } from '../services/responseService';
import Axios from "axios";
import { createPathKey } from '../helper';
import { ISwagger } from '../interfaces/ISwagger';
const endInJsonRegex = '(.json)$';

// export const getSwaggerJsons: ScheduledHandler = async (event: ScheduledEvent, context) => {
    export const getSwaggerJsons: APIGatewayProxyHandler = async (event, context) => {
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
                    paths: createPathKey(_response.data.paths)
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

    response.forEach((item) => {
        esService.index(item, SWAGGER_INDEX)
        .then((data) => {
            console.log(data)
        })
        .catch((error) => {
            console.log(error.message)
        })
    });

    return responseService.success(response);

    // Add To Elastic Search
}


