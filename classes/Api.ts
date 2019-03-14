import { dbService } from "../services/dbService";
import { elasticSearchService } from '../services/elasticSearchService';
import { IApi } from "../interfaces/IApi";
import { assignToBody } from '../helper';
import { AWSError } from 'aws-sdk';
import { DynamoDBStreamEvent } from "aws-lambda";
import { DynamoDB } from 'aws-sdk';


export class Api {
    private DATABASE_ID = 'api';
    private API_INDEX = process.env.ELASTIC_INDEX_API

    /**
     *
     *
     * @memberof Api
     */
    create = async (api: IApi) => {
        try {
            let response;
            const db: dbService = new dbService(this.DATABASE_ID);
            const esService: elasticSearchService = new elasticSearchService();

            await db.putItem(api)
                .then((data) => {
                    console.log(data);
                    response = assignToBody(api);
                })
                .catch((error: AWSError) => {
                    throw new Error(error.message);
                });

            await esService.index(api, process.env.ELASTIC_INDEX_API)
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

    readSingle = async (id: string): Promise<IApi> => {
        try {
            let response;

            const esService: elasticSearchService = new elasticSearchService();

            await esService.getItem(id, this.API_INDEX)
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

    readAll = async (): Promise<IApi[]> => {
        try {
            let response;
            const esService: elasticSearchService = new elasticSearchService();

            await esService.getItems(this.API_INDEX)
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

    delete = async (id: string) => {
        try {
            let response;
            const db: dbService = new dbService(this.DATABASE_ID);
            const esService: elasticSearchService = new elasticSearchService();


            await db.deleteItem(id)
                .then((data) => {
                    response = assignToBody(id);
                })
                .catch((error) => {
                    throw new Error(error.message);
                });

            await esService.delete(id, process.env.ELASTIC_INDEX_API)
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

    manuallyUpdateElasticSearch = async () => {
        try {
            let response;
            let listOfApis: IApi[];
            const db: dbService = new dbService(this.DATABASE_ID);
            await db.getAllItems()
                .then((data) => {
                    listOfApis = data.Items
                })
                .catch((error) => {
                    throw new Error(error.message);
                });

            const esService: elasticSearchService = new elasticSearchService();

            listOfApis.forEach(async (api) => {
                await esService.index(api, process.env.ELASTIC_INDEX_API)
                    .then(() => {
                        response = {
                            ...response,
                            [api.id]: 'successful'
                        }
                    })
                    .catch((error) => {
                        throw new Error('Elastic search cluster is down');
                    });
            });
            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    }

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

