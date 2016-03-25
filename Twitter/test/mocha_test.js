	/**

	 * New node file

	 */

	var request = require('request')

		, express = require('express')

		,assert = require("assert")

		,http = require("http");



	describe('http tests', function(){



		it('should return the start page if the url is correct', function(done){

			http.get('http://localhost:3010/', function(res) {

				assert.equal(200, res.statusCode);

				done();

			})

		});



		it('should not return the home page if the url is wrong', function(done){

			http.get('http://localhost:3000/dummyhomelink', function(res) {

				assert.equal(404, res.statusCode);

				done();

			})

		});

		it('should shoq if you able to reach sign up page', function(done){

			http.get('http://localhost:3010/signupform', function(res) {

				assert.equal(200, res.statusCode);

				done();

			})

		});

		it('should show if the url to loginpage is correct', function(done){

			http.get('http://localhost:3010/redirecToLogin', function(res) {

				assert.equal(200, res.statusCode);

				done();

			})

		});

		it('should display the profile page', function(done) {

			request.post(

				'http://localhost:3010/aftersignin',

				{ form: { fullnameLogin: 'siddhi.pai@gmail.com',passwordLogin:'qwerty' } },

				function (error, response, body) {

					assert.equal(200, response.statusCode);

					done();

				}

			);

		});

	});