const {model,Schema} = require('mongoose');


const userSchema = {
    email:{
        type:"String",
        required:true
    },
    name:{
        type:"String",
        required:true
    },
    phone:{
        type:"String",
        required:true

    },
    city:{
        type:"String",
        required:false
    },
    password:{
        type:"String",
        required:true
    },
    isEmailVerified:{
        type:"Boolean",
        default:false
    }
}

const User = model('user',userSchema);

module.exports = User;
