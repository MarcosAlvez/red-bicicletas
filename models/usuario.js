const mongoose = require('mongoose');
// Using mongoose.model instead of require statement!!
// const Reserva = mongoose.model('Reserva');
// const Token = mongoose.model('Token');
var Reserva = require('./reserva');
var Token = require('./token');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const crypto = require('randombytes');
const mailer = require('../mailer/mailer');
const {callbackPromise} = require("nodemailer/lib/shared");

const saltRounds = 10;

const validateEmail = function(email) {
   const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   return re.test(email);
};

const usuarioSchema = new Schema({
   nombre: {
      type: String,
      trim: true,
      required: [true, 'El nombre es obligatorio.']
   },
   email: {
      type: String,
      trim: true,
      required: [true, 'El email es obligatorio.'],
      lowercase: true,
      unique: true,
      validate: [validateEmail, 'Por favor, ingrese un email valido.'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
   },
   password: {
      type: String,
      required: [true, 'El password es obligatorio'],
   },
   passwordResetToken: String,
   passwordResetTokenExpires: Date,
   verificado: {
      type: Boolean,
      default: false
   }
});

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe con otro usuario.'});

usuarioSchema.pre('save', function(next) {
   if (this.isModified('password')){
      this.password = bcrypt.hashSync(this.password, saltRounds);
   }
   next();
});

usuarioSchema.methods.validPassword = function(password) {
   return bcrypt.compareSync(password, this.password);
};

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb) {
   const reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
   console.log(reserva);
   reserva.save(cb, (prom) => console.log(prom));
};

usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    const token = new Token({_userId: this.id, token: crypto(16).toString('hex')});
    const email_destination = this.email;
    token.save(function(err) {
        if (err) console.log(err.message);

        const mailOpt = {
            from: 'no_replay@red-bicicletas.com',
            to: email_destination,
            subject: 'Verificación de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para verificar su cuenta haga click en el siguiente link: \n' +
                'http://localhost:3000' + '\/token/confirmation\/' + token.token + '.\n'
        }

        mailer.sendMail(mailOpt, function(err) {
            if (err) console.log(err);
            console.log('A verification email has been sent to ' + email_destination);
        });
    });
};

usuarioSchema.methods.resetPassword = function(cb) {
    const token = new Token({_userId: this.id, token: crypto(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {
        if(err) console.log(err);

        const mailOpt = {
            from: 'no_replay@red-bicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para restablecer el password de su cuenta haga click en el siguiente link: \n' +
                'http://localhost:3000' + '\/resetPassword\/' + token.token + '.\n'
        }

        mailer.sendMail(mailOpt, function(err) {
            if (err) console.log(err);
            console.log('A password reset email has been sent to ' + email_destination);
        });
    })
}

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition, callback){
    const self = this;
    console.log(condition);
    self.findOne({
        $or: [{'googleId': condition.id}, {'email': condition.getEmail()}
        ]}, (err, result) =>{
            if(result){
                callback(err, result)
            }else{
                console.log('----------CONDITION----------');
                console.log(condition);
                let values = {};
                values.googleId = condition.id;
                values.email = condition.getEmail();
                values.nombre = condition.displayName || 'SIN NOMBRE';
                values.verificado = true;
                values.password = condition._json.etag;
                console.log('----------VALUES----------');
                console.log(values);
                self.create(values, ((error, result) => {
                    if(err) {console.log(err)}
                    return callback(err, result);
                }))
            }
        }
    )
}

module.exports = mongoose.model('Usuario', usuarioSchema);
