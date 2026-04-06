import Express from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
import { createUser } from "../../Handlers/UserMangament/userhandler.js"
const userRouter=Express.Router()
userRouter.use((req,res,next)=>
{
   
    
    try
    {
        const decodedtoken=jwt.verify(req.headers.token,process.env.Secret);
        if(decodedtoken.role=="admin")
        {
            next();
        }
        else
        {
         return  res.status(403).send("Unauthorized");
        }

    }
    catch(e)
    {
        console.log(e);
        res.status(403).send("Unauthorized");
    }
     
   
})
userRouter.post("/create",createUser);
export default userRouter;