const mongoose = require('mongoose');
const Reserva = require('../../models/reserva');
const Bicicleta = require('../../models/bicicleta');
const Usuario = require('../../models/usuario');


describe('Testing Usuarios ', function() {

    beforeEach(function(){

        var mongoDB = "mongodb://localhost/testdb";
        mongoose.connect(mongoDB, { useNewUrlParser:true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function(){
            console.log('We are connected to test database');
        });
    });

    afterEach(function(){
        Reserva.deleteMany({}, function(err, success) {
            if (err) console.log(err);
            Usuario.deleteMany({}, function( err, success ){
                if (err) console.log(err);
                Bicicleta.deleteMany({}, function(err, success)  {
                    if (err) console.log(err);
                });
            });
        });
    });

    describe('Cuando un usuario reserva una bicicleta', () => {
        it('debe existir una reserva', () => {
            const usuario = new Usuario({nombre: 'Marcos'});
            usuario.save();
            const bicicleta = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana'});
            bicicleta.save();

            const hoy = new Date();
            const mañana = new Date();
            mañana.setDate(hoy.getDate()+1);
            usuario.reservar(bicicleta.id, hoy, mañana, function(err, reserva) {
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas) {
                    console.log(reservas[0]);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);

                });
            });
        });
    });

});
