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
    db.dynamoDBDocuClient = dynamoDBDocuClient;
    beforeEach(() => {
    });
    describe('constructor' , () => {

    });

    describe('getItem' , () => {
        it('should call dynamoDBDocuClient getItem', () => {
            const id = 'xxx';
            db.getItem(id).then(() => {
                expect(dynamoDBDocuClient.get.resolves).to.equal(true);
            });
        });  
    });

    describe('putItem' , () => {
        it('should call dynamoDBDocuClient putItem', () => {
            const item = {
                test: 'test'
            };
            db.putItem(item).then(() => {
                expect(dynamoDBDocuClient.put.resolves).to.equal(true);
            });
        }); 
    });

    describe('deleteItem' , () => {
        it('should call dynamoDBDocuClient deleteItem', () => {
            const id = 'xxx';
            db.deleteItem(id).then(() => {
                expect(dynamoDBDocuClient.delete.resolves).to.equal(true);
            });
        }); 
    });

    describe('getAllItems' , () => {
        it('should call dynamoDBDocuClient scan', () => {
            db.getAllItems().then(() => {
                expect(dynamoDBDocuClient.scan.resolves).to.equal(true);
            });
        }); 
    });

    describe('verifyKey' , () => {
        it('should call dynamoDBDocuClient update', () => {
            const id = 'xxx';            
            db.verifyKey(id).then(() => {
                expect(dynamoDBDocuClient.update.resolves).to.equal(true);
            });
        }); 
    });

    describe('update' , () => {
        it('should call dynamoDBDocuClient update', () => {
            const id = 'xxx'; 
            const item = {
                test: 'test'
            };           
            db.update(id, item).then(() => {
                expect(dynamoDBDocuClient.update.resolves).to.equal(true);
            });
        }); 
    });

    describe('scan' , () => {
        it('should call dynamoDBDocuClient scan', () => { 
            const item = {
                test: 'test'
            };           
            db.scan(item).then(() => {
                expect(dynamoDBDocuClient.scan.resolves).to.equal(true);
            });
        }); 
    });


});
