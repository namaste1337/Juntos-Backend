/////////////////////////
// Requires 
/////////////////////////

var request = require("supertest");
var app		= require("./../../app");

/////////////////////////
// Static methods
/////////////////////////

// Root API path
const API_VERSION         = "/api/v1";
// End points
const LOGIN_ENDPOINT      = API_VERSION + "/login";
const SIGNUP_ENDPOINT     = API_VERSION + "/signup";
// Content Types
const CONTENT_HEADER      = "Content-Type";
const CONTENT_HEADER_JSON = "application/json;charset=utf-8"
// Response codes
const RESPONSE_CODE_200   = 200;
const RESPONSE_CODE_400   = 400;
// Ints
const USER_ID_MULTIPLIER  = 100000;

/////////////////////////
// Test
/////////////////////////
  
  // Data

  let emptyCredentialsData = {
    email:"",
    password:""
  };


  // Helper Methods

  function generateCredentials(){
    
    let credentialSuffix = Math.floor(Math.random() * USER_ID_MULTIPLIER);
    
    let credentials = {
      email:"user" + credentialSuffix,
      password:"user" + credentialSuffix
    }

    return credentials;

  }

  describe('Request to /signup', function(){

    //Negative Test

    it('Should return 400 status code since no credential are passed', function(done){

      request(app)
        .post(SIGNUP_ENDPOINT)
        .send(emptyCredentialsData)
        .expect(RESPONSE_CODE_400, done);

    });

    // Positive test

    it("Should return JSON format", function(done){

      let credentials = generateCredentials();

      request(app)
        .post(SIGNUP_ENDPOINT)
        .send(credentials)
        .expect(CONTENT_HEADER, /json/, done)

    });

    it("Should return a 200 since credentials where passed", function(done){

      let credentials = generateCredentials();

      request(app)
        .post(SIGNUP_ENDPOINT)
        .send(credentials)
        .expect(RESPONSE_CODE_200, done);

    });

    it("Should return a response body with user email infromation", function(done){

      let credentials = generateCredentials();
      let email       = credentials.email;

      request(app)
        .post(SIGNUP_ENDPOINT)
        .set(CONTENT_HEADER, CONTENT_HEADER_JSON)
        .send(credentials)
        .expect(RESPONSE_CODE_200, /email/, done);

    });


  });


	describe('Request to /login', function () {

    // Negative Test

    it('Should return 400 status code since no credentials are passed in body', function (done) {
			
			request(app)
			  .post(LOGIN_ENDPOINT)        
        .send(emptyCredentialsData)
			  .expect(RESPONSE_CODE_400, done);

		});

    // Positive test

    it('Should return JSON format', function (done) {
      
      let credentials = generateCredentials(); 

      request(app)
        .post(SIGNUP_ENDPOINT)
        .send(credentials)
        .then(response => {

          request(app)
            .post(LOGIN_ENDPOINT)
            .set(CONTENT_HEADER, CONTENT_HEADER_JSON)
            .send(credentials)
            .expect(CONTENT_HEADER, /json/, done);

        });

    });


    it("Should return 200", function(done){

      let credentials = generateCredentials();

      request(app)
        .post(SIGNUP_ENDPOINT)
        .send(credentials)
        .then(response => {

          request(app)
            .post(LOGIN_ENDPOINT)
            .set(CONTENT_HEADER, CONTENT_HEADER_JSON)
            .send(credentials)
            .expect(RESPONSE_CODE_200, done);

        })

    });

    it("Should return a response body with user email infromation", function(done){

      let credentials = generateCredentials();
      let email       = credentials.email;

      request(app)
        .post(SIGNUP_ENDPOINT)
        .send(credentials)
        .then(response => {

          request(app)
            .post(LOGIN_ENDPOINT)
            .set(CONTENT_HEADER, CONTENT_HEADER_JSON)
            .send(credentials)
            .expect(RESPONSE_CODE_200, /email/, done);

        })

    });

	});