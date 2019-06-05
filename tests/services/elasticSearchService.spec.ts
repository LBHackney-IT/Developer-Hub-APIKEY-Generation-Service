import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as elasticSearch from 'elasticsearch';
import * as httpAwsEs from 'http-aws-es';
import { elasticSearchService } from '../../services/elasticSearchService';
const expect = chai.expect;

describe('elasticSearchService', () => {
    
    describe('healthCheck', () => {
        let pingSpy : sinon.SinonSpy;
        beforeEach(() => {
            const esService = new elasticSearchService();
            const options = {
                hosts: ['http://example.com'],
                connectionClass: httpAwsEs,
                apiVersion: "6.3"
            };
            const esClient = new elasticSearch.Client(options);
            esService.esClient = esClient;
            pingSpy = sinon.spy(esService.esClient, 'ping');
            esService.healthCheck();
        });
        it('should call esClient ping', () => {
            expect(pingSpy.calledOnce).to.equal(true);
        });   
    });

    describe('index', () => {
        const body = {
            id: 'string_identifier'
        };
        let indexSpy : sinon.SinonSpy;
        let esService: elasticSearchService;
        beforeEach(() => {
            esService = new elasticSearchService();
            const options = {
                hosts: ['https://search-api-search-i7mzbfy4dowrf6r3offrnrjhze.eu-west-2.es.amazonaws.com'],
                connectionClass: httpAwsEs,
                apiVersion: "6.3"
            };
            const esClient = new elasticSearch.Client(options);
            esService.esClient = esClient;
            indexSpy = sinon.spy(esService.esClient, 'index');

        });
        it('should call esClient ping', () => {
            esService.index(body, 'api');
            expect(indexSpy.calledOnce).to.equal(true);
        });   
    });

    
});