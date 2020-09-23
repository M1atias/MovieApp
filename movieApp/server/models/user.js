const mongoose = require('mongoose');
const bcypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const userShema = mongoose.Schema({
    name:{
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        minglength:5
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        default:0
    },
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})

userShema.pre('save',function(next){
    var user = this;
    

    if(user.isModified('password')){

        bcypt.genSalt(saltRounds, function(err,salt){
            if(err) return next(err);
    
            bcypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err);
                user.password = hash
            })
        })
    }else{
        next()
    }
});


userShema.methods.comparePassword = function(plainPassword,cb){
    bcypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userShema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(),'secret')

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user);
    })
}

userShema.statics.findByToken = function(token,cb){
    var user = this;

    jwt.verify(token,'secret',function(err,decode){
        user.findOne({"_id":decode, "token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
}

const User = mongoose.model('User',userShema)

module.exports = { User }