import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { Api } from '../../classes/Api';
import { generateRandomApi, generateTestApis } from '../mock-db';
const expect = chai.expect;

describe('Api', () => {
    process.env.ELASTIC_INDEX_API = 'api';
    process.env.API_DYNAMODB_TABLE = 'apiStore-stage';
    process.env.ELASTIC_SEARCH_ENDPOINT = 'http://example.com';
    process.env.ELASTIC_SEARCH_VERSION = "6.3";

    describe('create', () => {
        let api: Api;
        let dbPutItemStub: sinon.SinonStub;
        let esIndexStub: sinon.SinonStub;

        api = new Api();
        dbPutItemStub = sinon.stub(api.db, 'putItem');
        esIndexStub = sinon.stub(api.esService, 'index');
        dbPutItemStub.returns(Promise.resolve());
        esIndexStub.returns(Promise.resolve());
        api.create(generateRandomApi());

        it('should call dbService.putItem', () => {
            expect(dbPutItemStub.called).to.be.equal(true);
        });
        it('should call esService.index', () => {
            expect(esIndexStub.called).to.be.equal(true);
        });
    });

    describe('readSingle', () => {
        let api: Api;
        let esGetItemStub: sinon.SinonStub;

        api = new Api();
        esGetItemStub = sinon.stub(api.esService, 'getItem');
        esGetItemStub.returns(Promise.resolve());
        api.readSingle('apiId');

        it('should call esService.getItem', () => {
            expect(esGetItemStub.called).to.be.equal(true);
        });
    });

    describe('readAll', () => {
        let api: Api;
        let esGetItemsStub: sinon.SinonStub;
        
        api = new Api();
        esGetItemsStub = sinon.stub(api.esService, 'getItems');
        esGetItemsStub.returns(Promise.resolve());
        api.readAll();

        it('should call esService.getItems', () => {
            expect(esGetItemsStub.called).to.be.equal(true);
        });
    });

    describe('delete', () => {
        let api: Api;
        let dbDeleteStub: sinon.SinonStub;
        let esDeleteStub: sinon.SinonStub;

        api = new Api();
        dbDeleteStub = sinon.stub(api.db, 'deleteItem');
        esDeleteStub = sinon.stub(api.esService, 'delete');

        dbDeleteStub.returns(Promise.resolve());
        esDeleteStub.returns(Promise.resolve());

        api.delete('api_id');

        it('should call dbService.delete', () => {
            expect(dbDeleteStub.called).to.be.equal(true);
        });
        it('should call esService.delete', () => {
            expect(esDeleteStub.called).to.be.equal(true);
        });
    });

    describe('manuallyUpdateElasticSearch', () => {
        let api: Api;
        let dbGetAllItemsStub: sinon.SinonStub;
        let esIndexStub: sinon.SinonStub;

        api = new Api();
        dbGetAllItemsStub = sinon.stub(api.db,'getAllItems');
        dbGetAllItemsStub.resolves(generateTestApis(4));;

        api.manuallyUpdateElasticSearch();

        it('should call dbService.getAllItems', () => {
            expect(dbGetAllItemsStub.called).to.be.equal(true);
        });
    });
});
