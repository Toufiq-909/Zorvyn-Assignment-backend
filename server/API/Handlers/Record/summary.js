
import sql from "../../../db.js";
import dotenv from "dotenv"
dotenv.config();
export async function summary(req,res)
{
    try
    {
        const result1=await sql `select type,sum(amount)as total from record group by type`
           console.log(result1);
           let netbalance=result1[1].total-result1[0].total
           if(result1[0].type!="expense")
           {
            netbalance=-1*netbalance
           }
           const result2=await sql `select category,sum(amount) as total from record group by category`
           console.log(result2);
           console.log(result1);
           console.log(netbalance);
           return res.status(200).json({overview:result1,netbalance:netbalance,category:result2})

           
    }
    catch(e)
    {
        console.log(e);
       return res.sendStatus(500);
    }
}
export async function recentActivity(req,res)
{
    try
    {
        const results=await sql `select * from record order by id desc limit 5`
        return res.status(200).json({recent:results})

    }
    catch(e)
{
    console.log(e);
    return res.sendStatus(500);
}
}
export async function trends(req,res)
{
    
}