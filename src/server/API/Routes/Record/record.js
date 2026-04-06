import Express from "express"
import { createRecord,deleteRecord ,getRecord,updateRecord} from "../../Handlers/Record/recordhanlder.js";
const RecordRouter=Express.Router();
RecordRouter.get("/",getRecord)
RecordRouter.use((req,res,next)=>

{
    if(req.body.role==="admin")
    {
        next();
    }
    else
    {
        res.status(403).send("Unauthorized");
    }
})
RecordRouter.post("/create",createRecord);
RecordRouter.post("/delete",deleteRecord)
RecordRouter.put("/update",updateRecord)
export default RecordRouter;