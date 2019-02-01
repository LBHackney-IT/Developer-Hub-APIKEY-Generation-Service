import * as elasticSearch from 'elasticsearch';
import * as httpAwsEs from 'http-aws-es';
import { elasticSearchIndexMap } from '../config/elasticSearchIndexMap';

export class elasticSearchService {

    private options = {
        hosts: [process.env.ELASTIC_SEARCH_ENDPOINT],
        connectionClass: httpAwsEs,
        apiVersion: process.env.ELASTIC_SEARCH_VERSION
    };
    private esClient: elasticSearch.Client; 

    constructor() {
        this.esClient = new elasticSearch.Client(this.options);
    }

    /**
     *
     *
     * @returns
     * @memberof elasticSearchService
     */
    async healthCheck() {
        return this.esClient.ping({
            requestTimeout: 30000,
        });
    }

    /**
     * @summary Creates or Updates a JSON document in index
     *
     * @param {object} body
     * @param {string} index
     * @returns
     * @memberof elasticSearchService
     */
    async index(body: object, index: string) : Promise<any> {
        if (!body['id'])
        {
            throw new Error("The ID is missing from this object");
        }
        const document = {
            index: index,
            type: 'object',
            id: body['id'],
            body: body
        };
        return this.esClient.index(document);
    }

    async delete(body: object, index: string) : Promise<any> {
        if (!body['id'])
        {
            throw new Error("The ID is missing from this object");
        }
        const document = {
            index: index,
            type: 'object',
            id: body['id']
        };
        
        return this.esClient.delete(document);
    }

    async refresh(index: string) : Promise<any> {
        const params: elasticSearch.IndicesRefreshParams = {
            index: index
        };
        return this.esClient.indices.refresh(params);
    }


}