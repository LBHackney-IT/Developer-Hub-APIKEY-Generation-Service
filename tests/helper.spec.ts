import 'mocha';
import * as chai from 'chai';
import { generateID } from '../helper';

const expect = chai.expect;
describe('Helper File', () => {
    describe('generateID', () => {
        it('should return a concatenated string', () => {
            const cognitoUsername = 'xxx';
            const apiID = 'apiID';
            const result = generateID(cognitoUsername, apiID);
            expect(result).to.equal('xxx_apiID');
        });
    });
});