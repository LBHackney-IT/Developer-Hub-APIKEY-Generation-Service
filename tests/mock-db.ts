import { IApi } from "../interfaces/IApi";
import { ISwagger } from "../interfaces/ISwagger";
import * as Faker from 'faker/locale/en_GB';
import { IPath } from "../interfaces/IPath";
import { IPathParameter } from '../interfaces/IPathParameter';


export const generateTestApis = (numberOfApis: number): IApi[] => {
    const apis: IApi[] = [];
    for (let i = 0; i < numberOfApis; i++) {
        apis.push(generateRandomApi());
    }
    return apis;
};

export const generateTestSwaggerEndpoints = (numberOfEndpoints: number) => {
    const swaggerEndpoints: ISwagger[] = [];
    for (let i = 0; i < numberOfEndpoints; i++) {
        swaggerEndpoints.push(generateRandomSwagger());
    }
};

const generateRandomSwagger = (): ISwagger => {
    return {
        id: Faker.random.alphaNumeric(8),
        title: Faker.lorem.word() + ' API',
        description: Faker.lorem.words(10),
        paths: generateRandomPaths(5),
        version: 'v1',
        last_updated: Faker.date.recent(1).getTime()
    };
};

const generateRandomPaths = (numberOfPaths: number): IPath[] => {
    const paths: IPath[] = [];
    const possibleRequestTypes = ['GET', 'POST'];
    for (let i = 0; i < numberOfPaths; i++) {
        paths.push({
            id: Faker.random.alphaNumeric(8),
            requestType: Faker.helpers.randomize(possibleRequestTypes),
            url: Faker.internet.url(),
            tags: [Faker.lorem.word()],
            summary: Faker.lorem.words(15),
            parameters: generatePathParameter(3),
            responses: {[Faker.random.number(100)] : 'Test'},
        });
    }

    return paths;
};

const generatePathParameter = (numberOfParameters: number): IPathParameter[] => {
    const parameters: IPathParameter[] = [];
    for (let i = 0; i < numberOfParameters; i++) {
        parameters.push({
            name: Faker.lorem.words(2),
            in: Faker.lorem.word(),
            description: Faker.lorem.words(10),
            required: Faker.random.boolean(),
            type: Faker.lorem.word()
        });
    }

    return parameters;
};

export const generateRandomApi = (): IApi => {
    return {
        id: Faker.random.alphaNumeric(8),
        title: Faker.lorem.word() + ' API',
        summary: Faker.lorem.words(10),
        compliant: {
            endpoint_documentation: Faker.random.boolean(),
            twelve_factor_conformant: Faker.random.boolean(),
            centralised_exception_monitoring: Faker.random.boolean(),
            automated_tests: Faker.random.boolean(),
            documentation: Faker.random.boolean(),
            automated_vulnerabilty_testing: Faker.random.boolean(),
            cloud_hosted: Faker.random.boolean(),
            deployment_pipeline: Faker.random.boolean(),
            centralised_logging: Faker.random.boolean(),
            open_source: Faker.random.boolean(),
            test_driven: Faker.random.boolean(),
            centralised_application_monitoring: Faker.random.boolean(),
            authentication: Faker.random.boolean(),
            automated_linting: Faker.random.boolean()
        },
        internal: Faker.random.boolean(),
        staging: {
            id: Faker.random.word(),
            url: Faker.internet.url(),
            swagger_url: Faker.internet.url(),
            deployed: Faker.random.boolean(),
            healthStatus: Faker.random.boolean()
        },
        production: {
            id: Faker.random.word(),
            url: Faker.internet.url(),
            swagger_url: Faker.internet.url(),
            deployed: Faker.random.boolean(),
            healthStatus: Faker.random.boolean()
        },
        development: {
            id: Faker.random.word(),
            url: Faker.internet.url(),
            swagger_url: Faker.internet.url(),
            deployed: Faker.random.boolean(),
            healthStatus: Faker.random.boolean()
        },
        description: Faker.lorem.words(20),
        approved: Faker.random.boolean(),
        stage: Faker.random.word(),
        github_url: Faker.internet.url(),
        owner: {
            product: {
                name: Faker.name.firstName() + ' ' + Faker.name.lastName(),
                contactDetails: Faker.internet.email()
            },
            technical: {
                name: Faker.name.firstName() + ' ' + Faker.name.lastName(),
                contactDetails: Faker.internet.email()
            }
        }
    };
};