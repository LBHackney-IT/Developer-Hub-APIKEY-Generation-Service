import 'mocha';
import * as chai from 'chai';
import { responseService } from '../../services/responseService';

const expect = chai.expect;

describe('responseService', () => {
    describe('success', () => {
        let response;
        const item = {
            id: 'string_identifier'
        };
        beforeEach(() => {
            response = responseService.success(item);
        });
        it('should return a status code of 200', () => {
            expect(response.statusCode).to.equal(200);
        });

        it('headers should have Access-Control-Allow-Origin key', () => {
            expect(response.headers).to.deep.include({'Access-Control-Allow-Origin': '*'});
        });

        it('headers should have Access-Control-Allow-Credentials key', () => {
            expect(response.headers).to.deep.include({'Access-Control-Allow-Credentials': true});
        });

        it('should stringify the body', () => {
            expect(response.body).to.be.a('string');
        });
        
    });

    describe('error', () => {
        let response;
        const statusCode = 403;
        beforeEach(() => {
            response = responseService.error('error', statusCode);
        });
        it('should return a status code of 403', () => {
            expect(response.statusCode).to.equal(statusCode);
        });

        it('headers should have Access-Control-Allow-Origin key', () => {
            expect(response.headers).to.deep.include({'Access-Control-Allow-Origin': '*'});
        });

        it('headers should have Access-Control-Allow-Credentials key', () => {
            expect(response.headers).to.deep.include({'Access-Control-Allow-Credentials': true});
        });

        it('should stringify the body', () => {
            expect(response.body).to.be.a('string');
        });

        it('body should contain error', () => {
            expect(response.body).to.contain('error');
        });
        
    });
});