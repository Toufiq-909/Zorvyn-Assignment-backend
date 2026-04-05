import bcrypt from "bcrypt"
import sql from "../../../db.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();
export async function login(req,res)
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
export async function changepassword(req,res)
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
