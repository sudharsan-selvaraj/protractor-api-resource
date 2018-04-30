# protractor-api-resource

[![Build Status](https://travis-ci.org/sudharsan-selvaraj/protractor-api-resource.svg?branch=master)](https://travis-ci.org/sudharsan-selvaraj/protractor-api-resource)

API testing is now made simple with protractor. **protractor-api-resource** is a REST Client framework created using **request** npm module to use in protractor tests for making API calls. Register all service endpoints as individual service methods and reuse the same inside the test. Inspired from **[angular-resource](https://docs.angularjs.org/api/ngResource/service/$resource)** project.


### Features

- Create reusable methods for all service end points once and use it throughout the tests.
- Supports all rest API methods(GET,POST,PUT,PATCH and DELETE).
- Supports authentication protected endpoints.
- Can be used in any node js projects.

### Why is it useful?
If you are using [Protractor](https://www.npmjs.com/package/protractor) for e2e testing and you need to get test data from API then this module will come handy with lot of predefined functionalities.

### Usage

##### Install using npm

`$ npm install protractor-api-resource`

#### Example

Using javascript, first import the npm module in your tests.
```javascript
const apiResource = require("protractor-api-resource").ProtractorApiResource
```

##### Javascript　

```javascript
describe("Test response for all REST API methods", function () {

    var apiClient, serviceEnpoints = {
        getPosts: {
            path: "/posts/:postId:"
        },
        createPost: {
            path: "/posts",
            method: "POST"
        },
        updatePost: {
            path: "/posts/:postId:",
            method: "PUT"
        },
        patchPost: {
            path: "/posts/:postId:",
            method: "PATCH"
        },
    };

     beforeAll(function () {
        apiClient = new apiResource("https://jsonplaceholder.typicode.com/");
        apiClient.registerService(serviceEnpoints);
    });
});
```

Thats it. Now you can directly access the service endpoints from your tests as below.
```javascript
it("Test GET method", function (done) {
    var expectedResponse = {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    };

    apiClient.getPosts({postId: 1}).toJSON().then(function (actualResponse) {
        expect(actualResponse).toEqual(expectedResponse);
        done();
    });
});

```

For **POST**,**PUT** and **PATCH** calls, you can also send payloads like,

```javascript
it("Test POST method", function (done) {
    var payLoad = {
        title: 'foo',
        body: 'bar',
        userId: 1
    };

    var expectedResponse = {
        id: 101,
        title: 'foo',
        body: 'bar',
        userId: 1
    };
    //First parameter is for query params and second parameter is for request payload.
    apiClient.createPost({}, payLoad).toJSON().then(function (actualResponse) {
        expect(actualResponse).toEqual(expectedResponse);
        done();
    });
});
```

`toJson()` method will parse the API respose and returns the respective  JSON object and `toSting()` willl return the plain string.

### What if the service enpoints are protected with authentication?

It's very simple. Just mention the type of authentication at the time of creating a object.

##### Basic authentication.
```javascript
var apiClient = new apiResource("https://jsonplaceholder.typicode.com/").withBasicAuth(username,password);
```

##### Token based authentication.
```javascript
var apiClient = new apiResource("https://jsonplaceholder.typicode.com/").withTokenAuthentication(token);
```

You can also modify the authencation type any time inside the tests using `apiClient .withTokenAuthentication(token)`

### Reference
https://github.com/sudharsan-selvaraj/protractor-api-resource/blob/master/test/spec/apiWithNoAuthentication.spec.js