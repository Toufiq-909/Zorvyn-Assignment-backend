import bcrypt from "bcrypt"
import sql from "../../../db.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();
export async function login(req,res)
{
    
    
    const [result]=await sql `select password from users where username=${req.body.name}`
 
    if(result!=null)
    {
          if(await bcrypt.compare(req.body.password,result.password))
    {
        let token=jwt.sign({username:req.body.username},process.env.Secret);
        return res.status(200).json({token:token})
    } 
    }
            return res.sendStatus(401)
        
    
    

}