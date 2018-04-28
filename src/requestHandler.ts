let request = require('request-promise');
let q = require('q');
import {browser} from "protractor";

export class RequestHandler {

    private requestMethods = {
        "GET": request.get,
        "POST": request.post,
        "PATCH": request.patch,
        "DELETE": request.delete,
        "PUT": request.put
    };

    makeRequest(requestObject, authType, authentication) {
        switch (authType) {
            case 0 :
                return new ResponseHandler(this.requestMethods[requestObject.method](requestObject));
            case 1 :
                return new ResponseHandler(this.requestMethods[requestObject.method](requestObject).auth(authentication.username, authentication.password));
            case 2 :
                return new ResponseHandler(this.requestMethods[requestObject.method](requestObject).auth(null, null, true, authentication.token));
            case 3 :
                return new ResponseHandler(this.handleCookieAuthentication(requestObject, authentication.cookie));
        }
    }

    private handleCookieAuthentication(requestObject, cookieNames) {
        return this.getCookieObjectFromBrowser()
            .then(function (cookieObject) {
                !requestObject.hasOwnProperty("header") && (requestObject["header"] = {});
                var cookieString = '';
                cookieNames.forEach(function (cookie) {
                    cookieString += `${cookie}=${cookieObject[cookie]};`
                    requestObject["header"][cookie] = cookieObject[cookie].toString();
                });
                requestObject["header"]["cookie"] = cookieString;
            });
    }

    private getCookieObjectFromBrowser() {
        var cookiePromise = q.defer();
        browser.driver.manage().getCookies().then(function (cookies) {
            var cookie_obj = {};
            for (var i = 0; i < cookies.length; i++) {
                cookie_obj[cookies[i].name] = cookies[i].value;
            }
            cookiePromise.resolve(cookie_obj);
        });
        return cookiePromise.promise;
    }

}

class ResponseHandler {

    private requestPromise;

    constructor(apiPromise:Promise<any>) {
        this.requestPromise = apiPromise;
    }

    toJSON() {
        return this.getResponse()
            .then(function (response) {
                return JSON.parse(response);
            });
    }

    toString() {
        return this.requestPromise;
    }

    getResponse() {
        return this.requestPromise
            .then(function (response) {
                return response;
            });
    }


}
