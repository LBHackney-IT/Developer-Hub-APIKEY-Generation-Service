import 'mocha';
import * as chai from 'chai';
import { generateID, assignToBody, createPathKey, getStage } from '../../utility/helper';

const expect = chai.expect;
describe('Helper File', () => {
    describe('generateID', () => {
        it('should return a concatenated string', () => {
            const cognitoUsername = 'xxx';
            const apiID = 'apiID';
            const stage = 'development';
            const result = generateID(cognitoUsername, apiID, stage);
            expect(result).to.equal('xxx_apiID_development');
        });
    });

    describe('assignToBody', () => {
        it('should return an object with the key (body)', () => {
            const item = 'item';
            const result = assignToBody(item);
            expect(result).to.have.key('body');
        });
    });

    describe('createPathKey', () => {
        it('should return an array of objects that have IPath', () => {
            const pathObject = {
                "/v1/work_orders/{workOrderReference}/available_appointments": {
                    "get": {
                        "tags": ["Appointments"],
                        "summary": "Returns available appointments for a Universal Housing work order",
                        "operationId": "V1Work_ordersByWorkOrderReferenceAvailable_appointmentsGet",
                        "consumes": [],
                        "produces": [],
                        "parameters": [
                            { "name": "workOrderReference", "in": "path", "required": true, "type": "string" }
                        ],
                        "responses": {
                            "200": { "description": "Returns the list of available appointments" },
                            "400": { "description": "If no valid work order reference is provided" },
                            "404": { "description": "Not Found" },
                            "500": { "description": "If any errors are encountered" }
                        }
                    }
                },
                "/v1/work_orders/{workOrderReference}/appointments": {
                    "get": {
                        "tags": ["Appointments"],
                        "summary": "Returns all appointments for a work order",
                        "operationId": "V1Work_ordersByWorkOrderReferenceAppointmentsGet",
                        "consumes": [],
                        "produces": [],
                        "parameters": [{ "name": "workOrderReference", "in": "path", "description": "UH work order reference", "required": true, "type": "string" }], "responses": { "200": { "description": "Returns a list of appointments for a work order reference" }, "404": { "description": "If there are no appointments found for the work orders reference" }, "500": { "description": "If any errors are encountered" } }
                    }, "post": {
                        "tags": ["Appointments"],
                        "summary": "Creates an appointment",
                        "operationId": "V1Work_ordersByWorkOrderReferenceAppointmentsPost",
                        "consumes": [
                            "application/json-patch+json",
                            "application/json",
                            "text/json",
                            "application/*+json"
                        ],
                        "produces": [],
                        "parameters": [
                            { "name": "workOrderReference", "in": "path", "description": "The reference number of the work order for the appointment", "required": true, "type": "string" },
                            { "name": "request", "in": "body", "required": false, "schema": { "$ref": "#/definitions/ScheduleAppointmentRequest" } }
                        ],
                        "responses": {
                            "200": { "description": "A successfully created repair request" }
                        }
                    }
                },
                "/v1/work_orders/{workOrderReference}/appointments/latest": {
                    "get": {
                        "tags": ["Appointments"],
                        "summary": "Returns the latest apointment for a work order",
                        "operationId": "V1Work_ordersByWorkOrderReferenceAppointmentsLatestGet",
                        "consumes": [],
                        "produces": [],
                        "parameters": [
                            { "name": "workOrderReference", "in": "path", "description": "UH work order reference", "required": true, "type": "string" }
                        ],
                        "responses": {
                            "200": { "description": "Returns an appointment for a work order reference" },
                            "404": { "description": "If there is no appointment found for the work order reference" },
                            "500": { "description": "If any errors are encountered" }
                        }
                    }
                }
            };

            const result = createPathKey(pathObject);

            expect(result).to.be.an('array');
            expect(result[0]).to.be.an('object');
        });
    });
    
    describe('getStage', () => {
        it('should return production if is prod is true', () => {
            process.env.IS_PROD = 'true';
            const result = getStage();
            expect(result).to.equal('production');
        });

        it('should return dev if is prod is false', () => {
            process.env.IS_PROD = 'false';
            const result = getStage();
            expect(result).to.equal('dev');
        });
    });


});