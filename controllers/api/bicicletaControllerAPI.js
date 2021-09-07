const Bicicleta = require('../../models/bicicleta');

exports.bicicleta_lists = function(req, res) {
    res.status(200).json({
        bicicletas: Bicicleta.allBicis
    });
};

exports.bicicleta_create = function(req, res) {
    const bici = new Bicicleta(req.body.id, req.body.color, req.body.modelo, [req.body.lat, req.body.lng]);
    Bicicleta.add(bici);
    
    res.status(200).json({
        bicicleta: bici
    });
};

exports.bicicleta_delete = function(req, res) {
    Bicicleta.removeById(req.body.id.toString());
    res.status(204).send();
};

exports.bicicleta_update = function(req, res) {
    let bici = Bicicleta.findById(req.body.id.toString());
    bici.id = req.body.id;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng];

    res.status(200).json({
        bicicleta: bici
    });
}
