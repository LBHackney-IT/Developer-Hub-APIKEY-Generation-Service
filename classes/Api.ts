import { dbService } from "../services/dbService";
import { elasticSearchService } from '../services/elasticSearchService';
import { IApi } from "../interfaces/IApi";
import { assignToBody } from '../utility/helper';
import { AWSError } from 'aws-sdk';
import { DynamoDBStreamEvent } from "aws-lambda";
import { DynamoDB } from 'aws-sdk';


export class Api {
    private DATABASE_ID = 'api';
    private API_INDEX = process.env.ELASTIC_INDEX_API
    db: dbService;
    esService: elasticSearchService;
    constructor() {
        this.db = new dbService(this.DATABASE_ID);
        this.esService = new elasticSearchService();
    }
    /**
     * This is a function to create and update and api
     *
     * @memberof Api
     */
    create = async (api: IApi) => {
        try {
            let response;

            await this.db.putItem(api)
                .then((data) => {
                    console.log(data);
                    response = assignToBody(api);
                })
                .catch((error: AWSError) => {
                    throw new Error(error.message);
                });
                
            await this.esService.index(api, process.env.ELASTIC_INDEX_API)
                .then((data) => {
                    console.log(data);
                })
                .catch((error: AWSError) => {
                    throw new Error(error.message);
                });

            return response;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    /**
     * This is a function to read a single API from the elasticSearch cluster
     *
     * @memberof Api
     */
    readSingle = async (id: string): Promise<IApi> => {
        try {
            let response;

            await this.esService.getItem(id, this.API_INDEX)
                .then((data) => {
                    response = assignToBody(data._source);
                }).catch((error) => {
                    throw new Error(error.message);
                });

            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * This is a function to retreive all API's from the 
     * elastic search
     *
     * @memberof Api
     */
    readAll = async (): Promise<IApi[]> => {
        try {
            let response;

            await this.esService.getItems(this.API_INDEX)
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

    /**
     * This is a function to delete API from both the DB and
     * elastic search
     *
     * @memberof Api
     */
    delete = async (id: string) => {
        try {
            let response;

            await this.db.deleteItem(id)
                .then((data) => {
                    response = assignToBody(id);
                })
                .catch((error) => {
                    throw new Error(error.message);
                });

            await this.esService.delete(id, process.env.ELASTIC_INDEX_API)
                .then((data) => {
                    console.log(data);
                })
                .catch((error: AWSError) => {
                    throw new Error(error.message);
                });

            return response;

        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * This is a function to manually put all apis in the db into 
     * the elastic search cluster
     * 
     * @memberof Api
     */
    manuallyUpdateElasticSearch = async () => {
        try {
            let response;
            let listOfApis: IApi[] = [];
            await this.db.getAllItems()
                .then((data) => {
                    listOfApis = data.Items
                })
                .catch((error) => {
                    throw new Error(error.message);
                });

            await Promise.all(listOfApis.map(async (api) => {
                await this.esService.index(api, process.env.ELASTIC_INDEX_API)
                    .then(() => {
                        response = {
                            ...response,
                            [api.id]: 'successful'
                        }
                    })
                    .catch((error) => {
                        throw new Error(error.message);
                    });
            }));
            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * This function automatically updates elastic search when an
     * object in DynamoDB is updated
     *
     * @memberof Api
     */
    automaticallyUpdateStoreFromStream = async (events: DynamoDBStreamEvent) => {
        try {
            // Instantiate AWS.DynamoDB.Unmarshall converter
            const convert = DynamoDB.Converter.unmarshall;
            // Instantiate Elastic Search Service
            const esService: elasticSearchService = new elasticSearchService();
            // Get Elastic search index
            const index: string = process.env.ELASTIC_INDEX_API;
            // Check the eventName for each record and perform action
            events.Records.forEach(async (record) => {
                switch (record.eventName) {
                    // Index new object when created in DynamoDB
                    case 'INSERT': {
                        // Convert from AWS Object to JS Object
                        const newObject = convert(record.dynamodb.NewImage);
                        await esService.index(newObject, index)
                            .then((data) => {
                                console.log('success', data);
                            }).catch((error) => {
                                throw new Error(error.message)
                            });
                        break;
                    }
                    // Index object when modified in DynamoDB                
                    case 'MODIFY': {
                        const newObject = convert(record.dynamodb.NewImage);
                        console.log(index, newObject);
                        await esService.index(newObject, index)
                            .then(() => {
                                console.log('success');
                            })
                            .catch((error) => {
                                console.log('error');
                                throw new Error(error.message)
                            });
                        break;
                    }
                    // delete object from index when removed in DynamoDB                
                    case 'REMOVE': {
                        const newObject = convert(record.dynamodb.NewImage);
                        await esService.delete(newObject.id, index)
                            .then((data) => {
                                console.log(data);
                            }).catch((error) => {
                                throw new Error(error.message)
                            });
                        break;
                    }
                }
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }


}

