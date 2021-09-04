const Bicicleta = require('../../models/bicicleta');
const request = require('request');

const server = require('../../bin/www');

beforeEach(() => {console.log( '‘testeando…’')});

describe('BicicletaAPI', () => {
    describe('GET BICICLETAS /', () => {
        it('Status 200', () => {
            // Prev State
            expect(Bicicleta.allBicis.length).toBe(0);

            // Action
            const aBici = new Bicicleta(1, 'rojo', 'urbana', [-34.94, -54.95]);
            Bicicleta.add(aBici);

            // Expected State
            request.get('http://localhost:3000/api/bicicletas', function (error, response, body) {
                expect(response.statusCode).toBe(200);
            });
        });
    });

    describe('POST BICICLETAS /create', () => {
        it('Status 200', (done) => {
            // Action and Expected State
            const headers = {"content-type": "application/json"};
            const aBici = '{ "id": 10, "color": "rojo", "modelo": "urbana", "lat": -34.94,"lng": -54.95 }';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: aBici
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(10).color).toBe("rojo");
                done();
            });

        });
    });

    describe('POST BICICLETAS /update', () => {
        it('Status 200', (done) => {
            // Prev State
            request.get('http://localhost:3000/api/bicicletas', function (error, response, body) {
                expect(body).toContain('{"bicicletas":[{"id":1,"color":"azul","modelo":"montaña","ubicacion":[-34.94,-54.95]},' +
                    '{"id":10,"color":"rojo","modelo":"urbana","ubicacion":[-34.94,-54.95]}]}');
            });

            // Action
            const headers = {"content-type": "application/json"};
            const aBici = '{ "id": 1, "color": "azul", "modelo": "montaña", "lat": -34.94,"lng": -54.95 }';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/update',
                body: aBici
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(1).color).toBe("azul");
                done();
            });
        });
    });

    describe('POST BICICLETAS /delete', () => {
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
    });
});
