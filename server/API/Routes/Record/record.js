import Express from "express"
import { createRecord,deleteRecord ,getRecord,updateRecord,recoverRecord} from "../../Handlers/Record/recordhanlder.js";
import { summary,recentActivity } from "../../Handlers/Record/summary.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const RecordRouter=Express.Router();
RecordRouter.get("/summary",summary)
RecordRouter.get("/recent",recentActivity)
RecordRouter.get("/",getRecord)
RecordRouter.use((req,res,next)=>
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
RecordRouter.post("/create",createRecord);
RecordRouter.post("/delete",deleteRecord)
RecordRouter.put("/update",updateRecord)
RecordRouter.put("/recover",recoverRecord)
export default RecordRouter;