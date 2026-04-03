import sql from "../../../db.js";
import nodemailer from "nodemailer"
import crypto from "crypto"
import bcrypt from "bcrypt"
import {  generateUsername } from "unique-username-generator";
import dotenv from "dotenv"

dotenv.config();
export async function  createUser(req,res)
{
    
    const username=generateUsername("_",4);
    const password=crypto.randomBytes(4).toString("hex");
    const hashedpassword=await bcrypt.hash(password,4);
    if(req.body.role!="viewer" && req.body.role!=admin && req.body.role!='analyst')
    {
        res.status(422).send("Invalid role")
    }
    try
    {
        const [result]=await sql `insert into users (username,password,role,"Active","generatedPassword") values (${username},${hashedpassword},${req.body.role},true,true)`;
        await sendmail(req.body.email,username,password,res)
    
           
    }
    catch(e)
    {
        console.log("Database Insertion failed")
        console.log(e);
        return res.sendStatus(500);
    }

}
 async function sendmail(email,username,password,res)
{
    let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'findvolunteer@gmail.com',
    pass: 'ehmm zcqp jbuk qtuo'
  }
});

let mailOptions = {
  from: "findvolunteer@gmail.com",
  to: email,
  subject: 'Your credentials',
  text: "username:"+username+"\n"+" password : "+password
};

 transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    return res.status(500).send("Mail failed")
  } else {
    console.log('Email sent: ' + info.response);
    return res.sendStatus(200);
  }
});
}