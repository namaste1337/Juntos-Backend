/////////////////////////
// Requires 
/////////////////////////

var request = require("supertest");
var app		  = require("./../../app");
var common  = require("./../common");

/////////////////////////
// Static methods
/////////////////////////

// End points
const LOGIN_ENDPOINT      = common.API_VERSION + "/login";
const SIGNUP_ENDPOINT     = common.API_VERSION + "/signup";
const LOGOUT_ENDPOINT     = common.API_VERSION + "/logout";
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
        .expect(common.RESPONSE_CODE_400, done);

    });

    // Positive test

    it("Should return JSON format", function(done){

      let credentials = generateCredentials();

      request(app)
        .post(SIGNUP_ENDPOINT)
        .send(credentials)
        .expect(common.CONTENT_HEADER, /json/, done)

    });

    it("Should return a 200 since credentials where passed", function(done){

      let credentials = generateCredentials();

      request(app)
        .post(SIGNUP_ENDPOINT)
        .send(credentials)
        .expect(common.RESPONSE_CODE_200, done);

    });

    it("Should return a response body with user email infromation", function(done){

      let credentials = generateCredentials();
      let email       = credentials.email;

      request(app)
        .post(SIGNUP_ENDPOINT)
        .set(common.CONTENT_HEADER, common.CONTENT_HEADER_JSON)
        .send(credentials)
        .expect(common.RESPONSE_CODE_200, /email/, done);

    });


  });


	describe('Request to /login', function () {

    // Negative Test

    it('Should return 400 status code since no credentials are passed in body', function (done) {
			
			request(app)
			  .post(LOGIN_ENDPOINT)        
        .send(emptyCredentialsData)
			  .expect(common.RESPONSE_CODE_400, done);

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
            .set(common.CONTENT_HEADER, common.CONTENT_HEADER_JSON)
            .send(credentials)
            .expect(common.CONTENT_HEADER, /json/, done);

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
            .set(common.CONTENT_HEADER, common.CONTENT_HEADER_JSON)
            .send(credentials)
            .expect(common.RESPONSE_CODE_200, done);

        })

    });

    it("Should return a response body with the user registered email", function(done){

      let credentials = generateCredentials();
      let email       = credentials.email;

      request(app)
        .post(SIGNUP_ENDPOINT)
        .send(credentials)
        .then(response => {

          request(app)
            .post(LOGIN_ENDPOINT)
            .set(common.CONTENT_HEADER, common.CONTENT_HEADER_JSON)
            .send(credentials)
            .expect(common.RESPONSE_CODE_200, /email/, done);

        })

    });

	});

  describe("Request to /logout", function(){

    // Positive test

    it("Should return a 200", function(done){

      request(app)
        .get(LOGOUT_ENDPOINT)
        .expect(common.RESPONSE_CODE_200, done);

    });

    it("Should return JSON", function(done){
      
      request(app)
        .get(LOGOUT_ENDPOINT)
        .expect(common.CONTENT_HEADER, /json/, done);

    });

    it("Should return a JSON body with the field 'unauthenticated':true", function(done){

      request(app)
        .get(LOGOUT_ENDPOINT)
        .expect(common.RESPONSE_CODE_200, /\"unauthenticated\":true/, done);

    })

  });