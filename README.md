# API Key Generator

This microservice manages API keys and API information for the Development Hub.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

AWS Cli

```
install aws cli
```

### Installing


Install NPM packages

```
npm install
```

### Run application locally

```
serverless offline start
```


## Running the tests

Explain how to run the automated tests for this system



## Deployment


```
serverless deploy
```


## Endpoints


### API Key


+ Get API Key
```
GET: /api-key?cognito_username={COGNITO_USERNAME}&api_id={API_ID}
```
#### Request Body
```
{}
```

#### Response Body
```
{
    "body": {
        "apiKey": "xxxxxxxx",
        "verified": false
    }
}
```

+ Create API Key

```
POST: /api-key
```
#### Request Body
```
{
	"cognito_username": "xxxx",
	"api_id": "income_collection"
}
```


#### Response Body
```
{
    "body": {
        "apiKey": "GDlLC3Fgejb5XEpz"
    }
}
```


+ Get All API keys for a user
```
GET: /api-key/{COGNITO_USERNAME}
```
#### Request Body
```
{}
```
#### Response Body
```
{
    "body": [
                {
                    "createdAt": 1548074985776,
                    "cognitoUsername": "cognitoUsername1",
                    "apiKey": "xxxxxx",
                    "id": "cognitoUsername_apiID",
                    "apiID": "income_collection",
                    "verified": false
                },
                {
                    "createdAt": 1548074985776,
                    "cognitoUsername": "cognitoUsername2",
                    "apiKey": "xxxxxx",
                    "id": "cognitoUsername_apiID",
                    "apiID": "income_collection",
                    "verified": false
                }
            ]   
}
```

+ Verify API Key
```
POST: /api-key
```
#### Request Body
```
{
	"cognito_username": "xxxx",
	"api_id": "income_collection"
}
```

#### Response Body
```
{
    "body": {
        "verified": true
    }
}
```

### API

+ Get API
```
GET: /api/{api_id}
```
#### Request Body
```
{}
```

#### Response Body
```
{
    {
        "body": {
            "compliant": {
                "build_run_stage": true,
                "scalable_process": false,
                "export_services": true,
                "rapid_start_shutdown": false,
                "revision_control": true,
                "environment_config": true,
                "dependency_management": true,
                "decoupled_services": true,
                "logging": false,
                "stateless_process": true,
                "maintain_consistency_between_stages": false,
                "admin_management_process": false
            },
            "summary": "The Asbestos API provides asbestos related information on London Borough of Hackney property stock.",
            "github_url": "https://github.com/LBHackney-IT/HackneyAsbestosAPI",
            "owner": {
                "name": "Name",
                "contactDetails": "name@email.com"
            },
            "production": {
                "deployed": true,
                "healthStatus": true,
                "url": "http://10.160.0.137:557/swagger/index.html",
                "swagger_url": "http://10.160.0.137:557/swagger/index.html"
            },
            "description": "The Asbestos API provides asbestos related information on London Borough of Hackney property stock. This API provides data from PSI2000, a data source that used to be hosted on-prem and that is currently accessed externally as a software as a service. The endpoints of Asbestos API allow access to data about inspections carried on in properties via the property references. If there is one or more inspections for a property, the id's contained allows to query other specific in order to get more specific asbestos data about the property like rooms, floors or elements. The API also allows to access to the actual documents related to asbestos inspections on properties like photos, floorplans and reports.",
            "id": "asbestos",
            "staging": {
                "deployed": true,
                "healthStatus": true,
                "url": "http://10.160.0.137:667/swagger/index.html",
                "swagger_url": "http://10.160.0.137:667/swagger/index.html"
            },
            "title": "Asbestos API"
    }
}
```

+ Create API
```
POST: /api
```
#### Request Body
```
{
    "id": "income_collection",
    "title": "Asbestos API",
    "summary": "The Asbestos API provides asbestos related information on London Borough of Hackney property stock.",
    "compliant": {
      "revision_control": true,
      "dependency_management": true,
      "environment_config": true,
      "decoupled_services": true,
      "build_run_stage": true,
      "stateless_process": true,
      "export_services": true,
      "scalable_process": false,
      "rapid_start_shutdown": false,
      "maintain_consistency_between_stages": false,
      "logging": false,
      "admin_management_process": false
    },
    "staging": {
      "url": "http://10.160.0.137:667/swagger/index.html",
      "swagger_url": "http://10.160.0.137:667/swagger/index.html",
      "deployed": true, 
      "healthStatus": true
    },
    "production": {
      "url": "http://10.160.0.137:557/swagger/index.html",
      "swagger_url": "http://10.160.0.137:557/swagger/index.html",
      "deployed": true, 
      "healthStatus": true
    },
    "github_url": "https://github.com/LBHackney-IT/HackneyAsbestosAPI",
    "owner": {
      "name": "Name",
      "contactDetails": "name@email.com"
    },
    "description": "The Asbestos API provides asbestos related information on London Borough of Hackney property stock. This API provides data from PSI2000, a data source that used to be hosted on-prem and that is currently accessed externally as a software as a service. The endpoints of Asbestos API allow access to data about inspections carried on in properties via the property references. If there is one or more inspections for a property, the id's contained allows to query other specific in order to get more specific asbestos data about the property like rooms, floors or elements. The API also allows to access to the actual documents related to asbestos inspections on properties like photos, floorplans and reports." 
  }
```

#### Response Body
```
{
    "body": {
        "compliant": {
            "build_run_stage": true,
            "scalable_process": false,
            "export_services": true,
            "rapid_start_shutdown": false,
            "revision_control": true,
            "environment_config": true,
            "dependency_management": true,
            "decoupled_services": true,
            "logging": false,
            "stateless_process": true,
            "maintain_consistency_between_stages": false,
            "admin_management_process": false
        },
        "summary": "The Asbestos API provides asbestos related information on London Borough of Hackney property stock.",
        "github_url": "https://github.com/LBHackney-IT/HackneyAsbestosAPI",
        "owner": {
            "name": "Name",
            "contactDetails": "name@email.com"
        },
        "production": {
            "deployed": true,
            "healthStatus": true,
            "url": "http://10.160.0.137:557/swagger/index.html",
            "swagger_url": "http://10.160.0.137:557/swagger/index.html"
        },
        "description": "The Asbestos API provides asbestos related information on London Borough of Hackney property stock. This API provides data from PSI2000, a data source that used to be hosted on-prem and that is currently accessed externally as a software as a service. The endpoints of Asbestos API allow access to data about inspections carried on in properties via the property references. If there is one or more inspections for a property, the id's contained allows to query other specific in order to get more specific asbestos data about the property like rooms, floors or elements. The API also allows to access to the actual documents related to asbestos inspections on properties like photos, floorplans and reports.",
        "id": "income_collection",
        "staging": {
            "deployed": true,
            "healthStatus": true,
            "url": "http://10.160.0.137:667/swagger/index.html",
            "swagger_url": "http://10.160.0.137:667/swagger/index.html"
        },
        "title": "Asbestos API"
    }
}
```

+ Get All Apis
```
GET: /api
```
#### Request Body
```
{}
```

#### Response Body
```
{
    {
        "body": {
            "compliant": {
                "build_run_stage": true,
                "scalable_process": false,
                "export_services": true,
                "rapid_start_shutdown": false,
                "revision_control": true,
                "environment_config": true,
                "dependency_management": true,
                "decoupled_services": true,
                "logging": false,
                "stateless_process": true,
                "maintain_consistency_between_stages": false,
                "admin_management_process": false
            },
            "summary": "The Asbestos API provides asbestos related information on London Borough of Hackney property stock.",
            "github_url": "https://github.com/LBHackney-IT/HackneyAsbestosAPI",
            "owner": {
                "name": "Name",
                "contactDetails": "name@email.com"
            },
            "production": {
                "deployed": true,
                "healthStatus": true,
                "url": "http://10.160.0.137:557/swagger/index.html",
                "swagger_url": "http://10.160.0.137:557/swagger/index.html"
            },
            "description": "The Asbestos API provides asbestos related information on London Borough of Hackney property stock. This API provides data from PSI2000, a data source that used to be hosted on-prem and that is currently accessed externally as a software as a service. The endpoints of Asbestos API allow access to data about inspections carried on in properties via the property references. If there is one or more inspections for a property, the id's contained allows to query other specific in order to get more specific asbestos data about the property like rooms, floors or elements. The API also allows to access to the actual documents related to asbestos inspections on properties like photos, floorplans and reports.",
            "id": "asbestos",
            "staging": {
                "deployed": true,
                "healthStatus": true,
                "url": "http://10.160.0.137:667/swagger/index.html",
                "swagger_url": "http://10.160.0.137:667/swagger/index.html"
            },
            "title": "Asbestos API"
    }
}
```
