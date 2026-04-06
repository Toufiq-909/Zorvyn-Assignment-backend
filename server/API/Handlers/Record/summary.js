import z from "zod"
import sql from "../../../db.js";
import dotenv from "dotenv"
dotenv.config();
export async function summary(req,res)
{
    try
    {
        const result1=await sql `select type,sum(amount)as total from record where deleted=false group by type`
           console.log(result1);
           let netbalance=result1[1].total-result1[0].total
           if(result1[0].type!="expense")
           {
            netbalance=-1*netbalance
           }
           const result2=await sql `select category,sum(amount) as total from record where deleted=false group by category`
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
        const results=await sql `select * from record where deleted=false order by id desc limit 5`
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
    console.log(req.query)
    const validrequest=z.array(z.xor([z.literal("week"),z.literal("month")]))
    const check=validrequest.safeParse(Object.keys(req.query))
    if(!check.success ||check.data.length==0)
    {
        return res.sendStatus(422);

    }
    console.log(check.data);

let results;
    try
    {
     if (check.data[0] === 'week') {
  results = await sql`
    SELECT
      SUM(amount)                    AS total,
      DATE_TRUNC('week', date)       AS period
    FROM record
    WHERE deleted = false
    GROUP BY DATE_TRUNC('week', date)
    ORDER BY period ASC
  `;
} else {
  results = await sql`
    SELECT
      SUM(amount)                    AS total,
      DATE_TRUNC('month', date)      AS period
    FROM record
    WHERE deleted = false
      
    GROUP BY DATE_TRUNC('month', date)
    ORDER BY period ASC
  `;
}

return res.status(200).json({ trends: results });

    }
    catch(e)
{
    console.log(e);
    return res.sendStatus(500);
}
    
}