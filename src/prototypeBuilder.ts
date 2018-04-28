import {RequestHandler} from './requestHandler';

export class ResourcePrototypeGenerator {

    private requesthandler:RequestHandler;

    constructor() {
        this.requesthandler = new RequestHandler();
    };

    public constructResource(apiDetailObject, authType, authentication) {
        let self = this;
        return function (params, payload) {
            params = params || apiDetailObject.params || "";
            var urlString = apiDetailObject.baseUrl + self.interpolateUrlWithParams(apiDetailObject.path, params);
            var requestObject = {
                uri: urlString,
                method: apiDetailObject.method || "GET"
            };

            if (apiDetailObject.method == "POST" || apiDetailObject.method == "PATCH" || apiDetailObject.method == "PUT") {
                requestObject["body"] = JSON.stringify(payload);
                requestObject["headers"] = {
                    "content-type": "application/json",
                }
            }

            return self.requesthandler.makeRequest(requestObject, authType, authentication);
        }
    }


    /**
     * Method to populate URL with paramater which will be passed as a jSON object.
     * @param {string} path
     * @param {Object} params
     *
     * While making GET requests, all parameters should be populated in url string itself.
     *
     * USAGE:
     * var url = "http://localhost:8000/datai-api/data-sets/"
     * var params = {
     *                 page : 1,
     *                 page_size:50,
     *                 pagination : "True"
     *               }
     *
     * OUTPUT: "http://localhost:8000/datai-api/data-sets/?page=1&page_size=50&paginate=True"
     *
     */
    private interpolateUrlWithParams(path?:string, params?:any) {
        var regexObject;
        for (var param in params) {
            if (params.hasOwnProperty(param) && path.indexOf(":" + param + ":") >= 0) {
                regexObject = new RegExp(":" + param + ":", "g");
                path = path.replace(regexObject, this.convertParamsToStringObject(params[param]));
            } else {
                path += path.substr(path.length - 1) == "/" ? "?" : "";

                // Check if end of url contains &.
                path += (path.substr(path.length - 1) == "&" || path.substr(path.length - 1) == "?") ?
                param + "=" + this.convertParamsToStringObject(params[param]) :
                "&" + param + "=" + this.convertParamsToStringObject(params[param]);
            }
        }
        return path;
    }

    /*
     * Util method to parse Array params ([1,2,3]) to respective JSON string.
     * This will be used when array parameter to be passed in GET request url.
     *
     * eg. when filtering data sets under multiple sources,
     *  `filter_source_in` parameter accepts array of data source id.
     */


    private convertParamsToStringObject(param?:any) {
        return Array.isArray(param) ? JSON.stringify(param) : param;
    }


}
