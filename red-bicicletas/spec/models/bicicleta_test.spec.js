var Bicicleta = require('../../models/bicicleta');
var mongoose = require('mongoose');

/*
Disclaimer:
Al correr los tests con function(done), jasmine hace un llamado async y no sabe el momento de
terminar la función, tirando timeout error.
*/

describe('Testing Bicicletas ', function() {

    beforeEach(function(){

        var mongoDB = "mongodb://localhost/testdb";
        mongoose.connect(mongoDB, { useNewUrlParser:true, useUnifiedTopology: true  });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function(){
            console.log('We are connected to test database');
            //done();
        });
    });

    afterEach(function(){
        Bicicleta.deleteMany({}, function( err, success ){
            if (err) console.log(err);
            // done();
        });
    });

    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de bicicletas', () => {
            var bici = Bicicleta.createInstance(1,"verde","urbana",[-34.5,-54.1]);
            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toEqual(-34.5);
            expect(bici.ubicacion[1]).toEqual(-54.1);
        });
    });

    describe('Bicicleta.allBici', () => {
        it('Comienza vacia', () => {
            Bicicleta.find( {}, function(err, bicis ) {
                expect(bicis.length).toBe(0);
                //done();
            });
        });
    });

    describe('Bicicleta.add', () => {
        it('Agrega una sola bicicleta', () => {

            const aBici = new Bicicleta({code:1, color:"verde", modelo:"urbana"});

            console.log(aBici);

            Bicicleta.add(aBici, ( err, newBici) => {
                if (err) console.log(err);
                Bicicleta.find({code:1},function( err, bicis ) {
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);
                    //done();
                });
            });
        });
    });

    describe('Bicicleta.findByCode', () => {
        it('debe devolver la bici con code 1', () => {
            const aBici = new Bicicleta({code:1, color:"verde", modelo:"urbana"});

            Bicicleta.add(aBici, ( err, newBici) => {
                if (err) console.log(err);
                var aBici2 = new Bicicleta({code:2, color:"roja", modelo:"urbana"});
                Bicicleta.findByCode(1,function( err, targetBici ) {

                    expect(targetBici.code).toEqual(aBici.code);
                    expect(targetBici.color).toEqual(aBici.color);
                    expect(targetBici.modelo).toEqual(aBici.modelo);

                    //done();

                });
            });
        });
    });

});
