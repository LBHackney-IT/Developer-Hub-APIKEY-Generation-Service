import { ISwagger } from '../interfaces/ISwagger';
import { elasticSearchService } from '../services/elasticSearchService';
import { assignToBody, createPathKey } from '../helper';
import Axios from "axios";

export class Swagger {
    private API_INDEX = process.env.ELASTIC_INDEX_API;
    private SWAGGER_INDEX = process.env.ELASTIC_INDEX_SWAGGER;
    private endInJsonRegex = '(.json)$';

    /**
     *
     *
     * @memberof Swagger
     */
    readSingle = async (apiId: string, pathId: string): Promise<ISwagger> => {
        try {
            let response;
            const esService: elasticSearchService = new elasticSearchService();
            await esService.getItem(apiId, this.SWAGGER_INDEX)
                .then((data) => {
                    const swaggerObject: ISwagger = data._source
                    const path = swaggerObject.paths.filter((path) => {
                        return path.id === pathId;
                    });
                    swaggerObject.paths = path;
                    response = assignToBody(swaggerObject);
                })
                .catch((error) => {
                    throw new Error(error.message)
                });

            return response;

        } catch (error) {

        }
    }

    /**
     *
     *
     * @memberof Swagger
     */
    readAll = async (): Promise<ISwagger[]> => {
        try {
            let response;
            const esService: elasticSearchService = new elasticSearchService();

            await esService.getSwaggerObjects(this.SWAGGER_INDEX)
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

            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    indexESWithSwaggerJson = async () => {
        try {
            let response;
            const esService: elasticSearchService = new elasticSearchService();
            await esService.getSwaggerUrls(this.API_INDEX)
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
                const regexResult = RegExp(this.endInJsonRegex).test(urlObject.production.swagger_url)
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
            }).filter((item) => {
                return item !== null;
            }));


            // response = response.filter((item) => {
            //     return item !== null;
            // });

            console.log(1, response);

            // Add Objects To Elastic Search

            response.forEach(async (item) => {
                await esService.index(item, this.SWAGGER_INDEX)
                    .then((data) => {
                        console.log(2, data)
                    })
                    .catch((error) => {
                        throw new Error(error.message);
                    })
            });

        } catch (error) {
            throw new Error(error.message);
        }
    }
}