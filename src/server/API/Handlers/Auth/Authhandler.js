import bcrypt from "bcrypt"
import sql from "../../../db.js";
import jwt from "jsonwebtoken"
import z from "zod";
import dotenv from "dotenv";

dotenv.config();
export async function login(req,res)
{
    const validuser=z.object({name:z.string().min(4).max(20),password:z.string().min(4).max(30)});
    const check=validuser.safeParse({name:req.body.name,password:req.body.password})
    if(!check.success)
    {
       return res.sendStatus(422)
    }
   
    
    try
    {
        const [result]=await sql `select password,"generatedPassword" from users where username=${req.body.name}`
 
    if(result!=null)
    {
          if(await bcrypt.compare(req.body.password,result.password))
    {
           if(result.generatedPassword)
           {
             return res.status(422).send("Change the password")
           }
        let token=jwt.sign({username:req.body.username},process.env.Secret);
        return res.status(200).json({token:token})
    } 
    }
            return res.sendStatus(401)
    }
    catch(e)
    {
        console.log(e);
      return  res.status(500),send("Server Failed");
    }
        
    
    

}
export async function changepassword(req,res)
{
    const validuser=z.object({name:z.string().min(4).max(20),password:z.string().min(4).max(30),
        newpassword:z.string().min(4).max(30)
    });
    const check=validuser.safeParse({name:req.body.name,password:req.body.password,
        newpassword:req.body.newPassword
    })
    if(!check.success)
    {
        return res.sendStatus("422").send("Invalid Credentials or New password not meeting the criteria");
    }

    
try
{
    const [result]=await sql `select password,"generatedPassword" from users where username=${req.body.name}`
 
    if(result!=null)
    {
          if(await bcrypt.compare(req.body.password,result.password))
    {
           const updatedHashedPassword=await bcrypt.hash(req.body.newPassword,3);
           const update=await sql `update users set password=${updatedHashedPassword},"generatedPassword"=false where username=${req.body.name}`
        let token=jwt.sign({username:req.body.username},process.env.Secret);
        return res.status(200).json({token:token})
    } 
    }
            return res.sendStatus(401)
}
catch(e)
{
    console.log(e);
    return res.sendStatus(500).send("Server failed");
}

}
