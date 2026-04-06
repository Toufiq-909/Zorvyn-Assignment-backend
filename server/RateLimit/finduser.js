import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
export async function findRole(req,res,next)
{
    try
    {
        let decoded=jwt.verify(req.headers.token,process.env.Secret);
        if(decoded.role=="admin")
        {
            req.maxRequest=3
        }
        else if(decoded.role=="analyst")
        {
            req.maxRequest=2
        }
        else
        {
            req.maxRequest=1;
        }
        req.username=decoded.username;
        console.log(req.username);
        console.log(req.maxRequest)
        next();


    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(403);
    }


}