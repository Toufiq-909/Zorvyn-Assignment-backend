import sql from "../../../db.js";
import nodemailer from "nodemailer"
import crypto from "crypto"
import bcrypt from "bcrypt"
import {  generateUsername } from "unique-username-generator";
import z from "zod"
import dotenv from "dotenv"
dotenv.config();
export async function  createUser(req,res)
{
    const validuser=z.object({email:z.email(),role:z.enum(["viewer","analyst","admin"])})
    const check=validuser.safeParse({email:req.body.email,
      role:req.body.role
    })
    if(!check.success)
    {
      console.log(check.error);
      return res.status(422).json({error:check.error});
    }
    const username=generateUsername("_",4);
    const password=crypto.randomBytes(4).toString("hex");
    const hashedpassword=await bcrypt.hash(password,4);
   
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
    pass: process.env.pass
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
export async function deleteUser(req,res)
{
    const validrequest=z.object({name:z.string().min(4).max(25)})
    const check=validrequest.safeParse({name:req.body.name})
    if(!check.success)
    {
      return res.sendStatus(422);
    }
    try
    {
      await sql `update users set "Active"=false where username=${req.body.name}`
      return res.sendStatus(200);
    }
    catch(e)
    {
      console.log(e);
      return res.sendStatus(500);
    }
}
export async function recoverUser(req,res)
{
    const validrequest=z.object({name:z.string().min(4).max(25)})
    const check=validrequest.safeParse({name:req.body.name})
    if(!check.success)
    {
      return res.sendStatus(422);
    }
    try
    {
      await sql `update users set "Active"=true where username=${req.body.name}`
      return res.sendStatus(200);
    }
    catch(e)
    {
      console.log(e);
      return res.sendStatus(500);
    }
}
export async function getUser(req,res)
{
  const validrequest=z.array(z.enum(["Active","id","role","username","generatedPassword"]))
  const keys=Object.keys(req.query);
  const check=validrequest.safeParse(keys)
  if(!check.success)
  {
    return res.sendStatus(422);
  }
  let condition=[]
  for(let i=0;i<keys.length;i++)
  {
      let key=keys[i];
      let value=req.query[key];
      condition.push(sql`${sql(key)}=${value}`)
  }
  let whereclause;

   whereclause=condition[0];
  
  
      for(let i=1;i<condition.length;i++)
{
  whereclause=sql`${whereclause} AND ${condition[i]}`

}

try
{
  if(whereclause!=undefined)
  {const results=await sql`select * from users where ${whereclause}`
  return res.status(200).json({results:results})

  }
  else
  {
    const results=await sql`select * from users `
  return res.status(200).json({results:results})
  }
  
}
catch(e)
{
  console.log(e)
  return res.sendStatus(500);
}
}