const nodemailer = require('nodemailer')

const sendMail = (email,name,id)=>{
    console.log(email);
    let transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true, // true for 465, false for other ports
        auth: {
          user: "1mv19is404@sirmvit.edu", // generated ethereal user
          pass: "sirmvit123", // generated ethereal password
        },
      });

      let data = {
        from: "1mv19is404@sirmvit.edu", // sender address
        to: email, // list of receivers
        subject: "Verify Accunt", // Subject line
        text: `Verify Your account by clicking this link`, // plain text body
        html: `<a href="http://localhost:5000/auth/verify/${id}">Verify Account</a>`, // html body
      }

      transporter.sendMail(data,(err,info)=>{
          console.log(err,info);
        if(err){
            return false;
        }
        return true;
      })


}

module.exports = sendMail;