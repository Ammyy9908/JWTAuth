const router = require('express').Router();
const User = require('../models/User');
const { check, validationResult }
    = require('express-validator');
const bcrypt = require('bcrypt');
const sendMail = require('../utils/sendMail');
const jwt = require('jsonwebtoken');

router.post('/register',check('email','Invalid Email').isEmail(),check("password","Password must be of minimum of 8 & maximum of 12 in length").isLength({
    min:8,
    max:12
}),async (req,res)=>{
    const errors = validationResult(req);
    const {email,name,password,phone} = req.body;
    console.log(errors);
    if(!errors.isEmpty()){
        return res.send(errors);
    }

    //check is this user already in database with this email

    const isUser = await User.findOne({email:email});
    if(isUser){
        return res.status(400).send({message:"User already registered with this email"});
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hashSync(password,saltRounds);
    
    new User({
        email,
        password:hashedPassword,
        name,
        phone:phone
    }).save().then((result)=>{
        console.log(result);
        if(!result){
         
                return res.status(500).send({message:"Internal server error"});
            
        }
        const {email,name,_id} = result;
        const isEmailSented = sendMail(email,name,_id);
        if(isEmailSented){
            res.status(200).send({message:"Regisration completed Verify Your Email"});
        }
       
        
    });
}).post('/login',check("email","Email must be a valid email address").isEmail(),async (req,res)=>{
    const {email,password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.send(errors);
    }

    //first check is user found in database with this email

    const user = await User.findOne({email:email});

    // if user not found send them a error message

    if(!user){
        return res.status(404).send({message:"User not exist with this email address"});
    }

    //else check user password match with founded user password

    const isPasswordMatched = await bcrypt.compareSync(password,user.password);
    if(!isPasswordMatched){
        return res.status(401).send({message:"Invalid username & password!"});
    }
    const token = await jwt.sign({id:user._id},"mysecret")
    res.status(200).send({message:"User logined!",token});


}).get('/verify/:uid',async (req,res)=>{
    const {uid} = req.params;

    //find the person with this id
    const user = await User.findOne({_id:uid});

    if(!user){
        return res.status(401).send({message:"Invalid Verification Link!"});
    }
    //update isEmailVerified
    User.updateOne({_id:uid},{isEmailVerified:true}).then(()=>{
        res.status(200).send({message:"Email Verified!"});
    }).catch((e)=>{
        console.log("Internal server error");
    })
})

module.exports = router;
