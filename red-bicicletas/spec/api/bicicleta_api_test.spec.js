const mongoose = require('mongoose');
const Bicicleta = require('../../models/bicicleta');
const request = require('request');
const server = require('../../bin/www');

const base_url = "http://localhost:3000/api/bicicletas";


describe('BicicletaAPI', () => {
    beforeEach(function() {
        var mongoDB = "mongodb://localhost/testapidb";
        mongoose.connect(mongoDB, { useNewUrlParser:true, useUnifiedTopology: true  });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function(){
            console.log('We are connected to test database');
            done();
        });
    });

    afterEach(function(){
        Bicicleta.deleteMany({}, function( err, success ){
            if (err) console.log(err);
        });
    });

    describe('GET BICICLETAS /', () => {
        it('Status 200', () => {
            // Prev State
            Bicicleta.allBicis((err, bicis) => {
                expect(bicis.length).toBe(0);
            });

            // Action
            const aBici = new Bicicleta({code:1, color:'rojo', modelo:'urbana'});
            Bicicleta.add(aBici, (err, newBici) => {
                if(err) console.log(err);
            });

            // Expected State
            request.get(base_url, (error, response, body) => {
                expect(response.statusCode).toBe(200);
            });
        });
    });

    describe('POST BICICLETAS /create', () => {
        it('Status 200', () => {
            // Action and Expected State
            const headers = {"content-type": "application/json"};
            const aBici = '{ "code": 10, "color": "rojo", "modelo": "urbana", "lat": -34.94,"lng": -54.95 }';
            request.post({
                headers: headers,
                url: base_url+'/create',
                body: aBici
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                Bicicleta.findByCode(1,(err, bici) => {
                    if(err) console.log(err);
                    expect(bici.code).toBe(1);
                });
            });

        });
    });

    describe('POST BICICLETAS /update', () => {
        it('Status 200', () => {
            var aBici = new Bicicleta({code:1, color:"verde", modelo:"urbana"});

            aBici.save(( err, bici ) => {
                if (err) console.log(err);

                Bicicleta.findOne({_id:bici._id}, 'code color  modelo').exec(( err, bicicleta) => {
                    if ( err ) console.log( err );

                    console.log(bicicleta);

                    var headers = {'content-type' : 'application/json'};
                    var biciUpdate = '{ "code":1,"color":"Red","modelo":"Urbano","lat": "-35.59","lng": "-54.95" }';

                    console.log(bicicleta);

                    request.post({
                            headers : headers,
                            url : base_url+'/update',
                            body : biciUpdate

                        },
                        function(error, response, body) {
                            expect(response.statusCode).toBe(200);
                            Bicicleta.findByCode(1, ( err, bicicleta) => {
                                if ( err) console.log(err);
                                expect(bicicleta.code).toBe(1);
                            });
                        });

                });
            });
        });
    });

    /*describe('POST BICICLETAS /delete', () => {
        it('Status 204', () => {
            // Prev State
            request.get('http://localhost:3000/api/bicicletas', function (error, response, body) {
                expect(body).toContain('{"bicicletas":[{"id":1,"color":"rojo","modelo":"urbana","ubicacion":[-34.94,-54.95]}]}');
            });

            // Actions and Expected State
            const headers = {"content-type": "application/json"};
            const targetBici = '{ "id": 10}';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/delete',
                body: targetBici
            }, function (error, response, body) {
                expect(response.statusCode).toBe(204);
                request.get('http://localhost:3000/api/bicicletas', function (error, response, body) {
                    expect(body).toContain('{"bicicletas":[]}');
                });
            });
        });
    });*/
});
