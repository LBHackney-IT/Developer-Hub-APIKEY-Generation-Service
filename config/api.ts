import { I_api } from "../interfaces";

export class asbestosAPI implements I_api {
    id: string = 'asbestos';
    name: string = 'Asbestos API';
};

export class incomeCollectionAPI implements I_api {
    id: string = 'income_collection';
    name: string = 'Income Collection API';
};

export class manageATenancyAPI implements I_api {
    id: string = 'manage_a_tenancy';
    name: string = 'Manage A Tenancy API';
};

export class neighbourhoodContactCentreAPI implements I_api {
    id: string = 'neighbourhood_contact_centre';
    name: string = "Neighbourhood Contact Centre API";
}

export class rentAccountAPI implements I_api {
    id: string = 'rent_account';
    name: string = "Rent Account API";
}

export class repairsAPI implements I_api {
    id: string = 'repairs';
    name: string = "Repairs API";
}

export class tenancyAPI implements I_api {
    id: string = 'tenancy';
    name: string = "Tenancy API";
}

export class tenancyManagementProcessAPI implements I_api {
    id: string = 'tenancy_management_process';
    name: string = "Tenancy Management Process API";
}


