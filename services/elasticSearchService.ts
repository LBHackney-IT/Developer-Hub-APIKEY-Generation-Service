import * as elasticSearch from 'elasticsearch';
import * as httpAwsEs from 'http-aws-es';

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

    /**
     *
     *
     * @param {string} id
     * @param {string} index
     * @returns {Promise<any>}
     * @memberof elasticSearchService
     */
    async getItem(id: string, index: string): Promise<any> {
        const document = {
            index: index,
            type: 'object',
            id: id
        };

        return this.esClient.get(document);
    }

    /**
     *
     *
     * @param {string} index
     * @returns {Promise<any>}
     * @memberof elasticSearchService
     */
    async getItems(index: string): Promise<any> {
        const document = {
            index: index,
            q: 'approved:true'
        };

        return this.esClient.search(document);
    }

    /**
     *
     *
     * @param {string} index
     * @returns {Promise<any>}
     * @memberof elasticSearchService
     */
    async getSwaggerUrls(index: string): Promise<any> {
        const document = {
            index: index,
            q: 'approved:true',
            _source: ['id', 'production.swagger_url']        
        };
        return this.esClient.search(document);
    }

    /**
     *
     *
     * @param {string} index
     * @returns {Promise<any>}
     * @memberof elasticSearchService
     */
    async getSwaggerObjects(index: string) : Promise<any> {
        const document = {
            index: index,
            q: ''
        };

        return this.esClient.search(document);
    }


    /**
     *
     *
     * @param {object} body
     * @param {string} index
     * @returns {Promise<any>}
     * @memberof elasticSearchService
     */
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

    /**
     *
     *
     * @param {string} index
     * @returns {Promise<any>}
     * @memberof elasticSearchService
     */
    async refresh(index: string) : Promise<any> {
        const params: elasticSearch.IndicesRefreshParams = {
            index: index
        };
        return this.esClient.indices.refresh(params);
    }


}