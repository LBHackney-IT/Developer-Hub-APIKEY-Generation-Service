import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { dbService } from '../../services/dbService';
const expect = chai.expect;

describe('dbService' , () => {
    process.env.API_DYNAMODB_TABLE = 'api';
    const tableName = 'api';
    const db = new dbService(tableName);
    const dynamoDBDocuClient = sinon.stub(db.dynamoDBDocuClient);
    beforeEach(() => {
    });
    describe('constructor' , () => {

    });

    describe('getItem' , () => {
        it('should call dynamoDBDocuClient getItem', () => {
            const id = 'xxx';
            db.getItem(id).then(() => {
                expect(dynamoDBDocuClient.get.calledOnce).to.equal(true);
            });
        });  
    });

    describe('putItem' , () => {
        
    });

    describe('deleteItem' , () => {
        
    });

    describe('getAllItems' , () => {
        
    });
});
