import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { apiKeyService } from '../../services/apiKeyService';
import { IStatement } from '../../interfaces/IStatement';
import { IPolicyDocument } from '../../interfaces/IPolicyDocument';
const expect = chai.expect;

describe('apiKeyService' , () => {

    process.env.ENCRYPT_SECRET = 'xxxx';
    process.env.ENCRYPT_IV = 'vdsfs';
    describe('create' , () => {
        const response: string = apiKeyService.create();
        it('should be 16 characters long', () => {
            expect(response).to.have.lengthOf(16);
        });   

        it('should be a string', () => {
            expect(response).to.be.a('string');
        }); 
    });

    describe('encrypt' , () => {
        const apiKey = 'jsdnfajn2jnsgds3';
        const response: string = apiKeyService.encrypt(apiKey);
        it('the apiKey should be different from the output of the function', () => {
            expect(response).to.not.equal(apiKey);
        }); 
    });

    describe('decrypt' , () => {
        const apiKey = 'jsdnfajn2jnsgds3';

        const response: string = apiKeyService.decrypt(
            apiKeyService.encrypt(apiKey)
            );
        it('the apiKey should equal from the output of the function', () => {
            expect(response).to.equal(apiKey);
        });
    });

    describe('generatePolicy' , () => {
        const principalId = 'xxxxx';
        const effect = 'Allow';
        const methodArn = 'xxxx';
        it('should call createStatement', () => {
            let createStatementSpy: sinon.SinonSpy = sinon.spy(apiKeyService, 'createStatement');
            apiKeyService.generatePolicy(principalId, effect, methodArn);
            expect(createStatementSpy.calledOnce).to.equal(true);
        }); 

        it('should call createPolicyDocument', () => {
            let createPolicyDocumentSpy: sinon.SinonSpy = sinon.spy(apiKeyService, 'createPolicyDocument');
            apiKeyService.generatePolicy(principalId, effect, methodArn);
            expect(createPolicyDocumentSpy.calledOnce).to.equal(true);
        }); 

        it('should call createAuthResponse', () => {
            let createAuthResponseSpy: sinon.SinonSpy = sinon.spy(apiKeyService, 'createAuthResponse');
            apiKeyService.generatePolicy(principalId, effect, methodArn);
            expect(createAuthResponseSpy.calledOnce).to.equal(true);
        }); 
    });

    describe('createStatement' , () => {
        const effect = 'Allow';
        const resource = 'xxxx';
        it('should return an object with specific keys', () => {
            const response = apiKeyService.createStatement(effect, resource);
            expect(response).to.have.property('Action');
            expect(response).to.have.property('Effect');
            expect(response).to.have.property('Resource');
        }); 
    });

    describe('createPolicyDocument' , () => {
        const effect = 'Allow';
        const resource = 'xxxx';
        const action = 'execute-api:Invoke';
        const statement: IStatement = {
            Action: action,
            Effect: effect,
            Resource: resource
        }
        it('should return an object with specific keys', () => {
            const response = apiKeyService.createPolicyDocument(statement);
            expect(response).to.have.property('Version');
            expect(response).to.have.property('Statement');
        }); 
    });

    describe('createAuthResponse' , () => {
        const effect = 'Allow';
        const resource = 'xxxx';
        const action = 'execute-api:Invoke';
        const principalId = 'xxxx';
        const statement: IStatement = {
            Action: action,
            Effect: effect,
            Resource: resource
        };
        const statementArray: IStatement[] = [statement];
        const policyDocument : IPolicyDocument = {
            Version: 'xxx',
            Statement: statementArray
        };
        it('should return an object with specific keys', () => {
            const response = apiKeyService.createAuthResponse(principalId, policyDocument);
            expect(response).to.have.property('principalId');
            expect(response).to.have.property('policyDocument');
        }); 
    });

    describe('methodArn' , () => {
        const methodArn = 'arn:aws:execute-api:eu-west-2:7730:g6g0ojk/staging/GET/address/*';
        
        it('getApiId' , () => {
            const response = apiKeyService.getApiId(methodArn);
            expect(response).to.equal('address');
        });

        it('getMethod' , () => {
            const response = apiKeyService.getMethod(methodArn);
            expect(response).to.equal('GET');
        });

        it('getStage' , () => {
            const response = apiKeyService.getStage(methodArn);
            expect(response).to.equal('staging');
        });

    });




});