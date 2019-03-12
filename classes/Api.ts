import { dbService } from "../services/dbService";
import { elasticSearchService } from '../services/elasticSearchService';
import { IApi } from "../interfaces/IApi";
import { assignToBody } from '../helper';
import { AWSError } from 'aws-sdk';

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
                    response = assignToBody(data.Attributes);
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

    readAll = async () : Promise<IApi[]>  => {
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
    
            await db.deleteItem(id)
                .then((data) => {
                    response = assignToBody(`${id} has been deleted`);
                })
                .catch((error) => {
                    throw new Error(error.message);
                });
    
            return response;
    
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

