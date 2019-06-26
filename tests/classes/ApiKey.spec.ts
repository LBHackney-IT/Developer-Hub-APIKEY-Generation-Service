import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { IApi } from '../../interfaces/IApi';
import { ApiKey } from '../../classes/ApiKey';
import { dbService } from '../../services/dbService';
import { assignToBody } from '../../utility/helper';
import { ICreateKeyRequest } from '../../interfaces/IRequests';
const expect = chai.expect;

describe('ApiKey', () => {
    process.env.APIKEY_DYNAMODB_TABLE = 'apiKeyStore-stage';
    process.env.REGION = 'eu-west-2';
    describe('create', () => {
        // const API_KEY_STORE_DATABASE_ID = 'apiKey';
        // const createKeyRequest: ICreateKeyRequest = {
        //     cognitoUsername: 'cognitoUsername',
        //     apiId: 'api_id',
        //     email: 'email',
        //     stage: 'stage'
        // };
        // let apikey: ApiKey;
        // let dbStub: sinon.SinonStub;
        // let response = assignToBody({
        //     message: 'Your Key has been created'
        // });
        // apikey = new ApiKey();
        // apikey.db = new dbService(API_KEY_STORE_DATABASE_ID);
        // dbStub = sinon.stub(apikey.db, 'putItem');
        // // .resolves(response);

        // it('should call db.putItem', () => {
        //     apikey.create(createKeyRequest);
        //     expect(dbStub.called).to.equal(true);           
        // });
    });

    describe('refresh', () => {
        it('should call db.update', () => {

        });
    });

    describe('updateLastAccessed', () => {
        it('should call db.update', () => {

        });
    });

    describe('logRequest', () => {
        it('should call db.putItem', () => {

        });
    });

    describe('readSingle', () => {
        it('should call db.getItem', () => {

        });
    });

    describe('readAllForUser', () => {
        it('should call db.getItem', () => {

        });

        it('should call db.scan', () => {

        });
    });

    
});
