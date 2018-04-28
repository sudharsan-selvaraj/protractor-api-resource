var url = require('url');
import {ResourcePrototypeGenerator} from './prototypeBuilder';

enum AUTHENTICATION_TYPES {
    NO = 0,
    BASIC = 1,
    TOKEN = 2,
    COOKIE = 3
}
;

export class ProtractorApiResource {

    private host:string;
    private port:number;
    private baseUrl:string;
    private AUTH_TYPE:AUTHENTICATION_TYPES = AUTHENTICATION_TYPES.NO;
    private authentication = {
        username: "",
        password: "",
        token: "",
        cookie: []
    };
    private resourcePrototypeGenerator:ResourcePrototypeGenerator;
    private apiDetails = {};

    constructor(host:string, port?:number) {
        this.parseBaseUrl(host, port);
        this.resourcePrototypeGenerator = new ResourcePrototypeGenerator();
    }


    registerService(apiDetailObject:{}) {
        let self = this;
        this.apiDetails = apiDetailObject;
        Object.keys(apiDetailObject).map(function (apiDetails) {
            apiDetailObject[apiDetails].baseUrl = self.baseUrl;
            ProtractorApiResource.prototype[apiDetails] = self.resourcePrototypeGenerator.constructResource(apiDetailObject[apiDetails], self.AUTH_TYPE, self.authentication);
        });

        return this;
    }

    withBasicAuth(username:any, password:any):this {
        this.AUTH_TYPE = AUTHENTICATION_TYPES.BASIC;
        this.authentication.username = username;
        this.authentication.password = password;
        return this;
    }

    withTokenAuthentication(token:any):this {
        this.AUTH_TYPE = AUTHENTICATION_TYPES.BASIC;
        this.authentication.token = token;
        return this;
    }

    withCookieAuthentication(cookieNames:string[]):this {
        this.AUTH_TYPE = AUTHENTICATION_TYPES.BASIC;
        this.authentication.cookie = cookieNames;
        return this;
    }

    reConstructResource():this {
       this.registerService(this.apiDetails);
        return this;
    }

    private parseBaseUrl(host:string, port:number) {
        try {
            this.host = host;
            this.port = port || null;
            this.baseUrl = url.parse(host + (port || "")).href.replace(/\/$/, '');
        } catch (err) {
            throw new Error(err);
        }
    }
}