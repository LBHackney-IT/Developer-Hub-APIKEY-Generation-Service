import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as elasticSearch from 'elasticsearch';
import * as httpAwsEs from 'http-aws-es';
import { elasticSearchService } from '../../services/elasticSearchService';
const expect = chai.expect;

describe('elasticSearchService', () => {
    process.env.ELASTIC_SEARCH_ENDPOINT = 'http://example.com';
    process.env.ELASTIC_SEARCH_VERSION = "6.3";
    let esService: elasticSearchService;
    esService = new elasticSearchService();
    const esClient = sinon.stub(esService.esClient);

    beforeEach(() => {
    });
    
    describe('healthCheck', () => {
        it('should call esClient ping', () => {
            esService.healthCheck();
            expect(esClient.ping.calledOnce).to.equal(true);
        });   
    });

    describe('index', () => {
        const body = {
            id: 'string_identifier'
        };
        it('should call esClient index', () => {
            esService.index(body, 'api');
            expect(esClient.index.calledOnce).to.equal(true);
        });   
    });

    describe('getItem', () => {
        it('should call esClient get', () => {
            const id = 'string_identifier';
            esService.getItem(id, 'api');
            expect(esClient.get.calledOnce).to.equal(true);
        });   
    });

    describe('getItems', () => {
        it('should call esClient search', () => {
            esService.getItems('api');
            expect(esClient.search.calledOnce).to.equal(true);
        });   
    });

    describe('getSwaggerUrls', () => {
        it('should call esClient search', () => {
            esService.getSwaggerUrls('api');
            expect(esClient.search.called).to.equal(true);
        });   
    });

    describe('getSwaggerObjects', () => {
        it('should call esClient search', () => {
            const id = 'string_identifier';
            esService.getSwaggerObjects('api');
            expect(esClient.search.called).to.equal(true);
        });   
    });

    describe('delete', () => {
        it('should call esClient delete', () => {
            const id = 'string_identifier';
            esService.delete(id, 'api');
            expect(esClient.delete.calledOnce).to.equal(true);
        });   
    });
    
});