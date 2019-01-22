const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt=require('bcrypt-nodejs');
const crypto=require('crypto');
const Schema=mongoose.Schema;

const UserSchema=new Schema({

    
        password: String,
        email:{
            type:String,
            lowercase: true,
            required:true,
            trim:true,
            minlength:1,
            unique :true,
            validate: {
                validator: validator.isEmail,
                // short from
                //  validator: (value)=>{
                //     return validator.isEmail(value);
                // }
                message : `{Value}is not valid eMail address`
                        }
            },
    profile:{
        name: {type:String,unique :true,default:''},
        picture: {type:String,default:''},
      
    },
    address: String,
    history:[{
        date:Date,
        paid:{type:Number,default: 0},

    }],
});

// Hash the password before save it to the database
UserSchema.pre('save',function(next){

    let user = this; //>>>>> let user= new User ();
    if(!user.isModified('password')) return next();
    if(user.password){
        bcrypt.genSalt(10,(err,salt)=>{            
            if(err) return next(err);
            bcrypt.hash(user.password ,salt,null,(err,hash)=>{
                if(err) return next(err);
                user.password=hash;
                next(err);
            });
        });
    }
});
// Compare password in database and one user type in
// UserSchema.methods.comparePassword is custom method
UserSchema.methods.comparePassword=function(password){
    return bcrypt.compareSync(password , this.password);
    // this.password refers to UserSchema.password
};

//custom method
UserSchema.methods.gravatar=function(size){
    if(!this.size)size=200;
    if(!this.email)return 'https://gravatar.com/avatar/?s'+size+'&d=retro';
    let md5 =crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/'+md5+'?s='+'&d=retro';
}

module.exports = mongoose.model('User', UserSchema);

