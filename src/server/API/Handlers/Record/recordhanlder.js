import z from "zod"
import sql from "../../../db.js";
export async function createRecord(req,res)
{
    const validrequest=z.object({
        type:z.enum(["income","expense"]),
        category:z.string().min(4).max(30),
        Notes:z.string().nullable(),
        Date:z.string().min(4).max(20),
        amount:z.number().positive()})

        const check=validrequest.safeParse({amount:req.body.amount,
            type:req.body.type,category:req.body.category,Notes:req.body.notes,
            Date:req.body.date
        })
        if(!check.success)
        {
            console.log(check.error);
            return res.sendStatus(422);
        }
       
      
        try
        {
            console.log(req.body.date)
            let date=new Date(req.body.date)
            console.log(date);
            const [result]=await sql `insert into record (amount,type,category,notes,deleted,date) values (${req.body.amount},${req.body.type},${req.body.category},${req.body.notes},false,${date})`
             
            return res.status(200).send("Record Creation Successful")

        }
        catch(e)
        {
            console.log(e);
            return res.sendStatus(500);
        }


}

export async function deleteRecord(req,res)
{
    const validRequest=z.object({id:z.int().positive()})
    const check=validRequest.safeParse({id:req.body.id,})
    if(!check.success)
        {
            console.log(check.error);
            return res.sendStatus(422);
        }
        try
        {
            await sql `update record set deleted=true where id=${req.body.id}`
            return res.status(200).send("Deletion Successfull")
        }
        catch(e)
        {
            console.log("Deletion Failed");
            console.log(e);
            return res.sendStatus(500);
        }
}

export async function getRecord(req,res)
{
    
    const validrequest=z.array(z.union([z.literal("page"),z.enum(["amount","date","type","category","notes"])]))
    const check=validrequest.safeParse(Object.keys(req.query));
    if(!check.success)
    {
        console.log(check.error);
      return   res.status(400).send("Invalid field")
    }
    console.log(check.data);
    console.log(req.query.page+"asdf")
    const page=parseInt(req.query.page)
   console.log(page);
    if(isNaN(page)||page<=0)
    {
        
        return res.status(422).send("invalid page");
    }
    
    try
    {
        let offset=(page-1)*5
        let keys=Object.keys(req.query);
        keys=keys.filter((keys)=>keys!="page");

        if(Object.keys(req.query).length==0)
        {
const results=await sql `select * from record where deleted=false order by id ASC limit 5 offset ${offset} `
        return res.status(200).json({records:results});
        }
        else
        {
            delete req.query.page;
            let conditions = [sql`deleted = false`];

for (let i = 0; i < keys.length; i++) {
  const key = keys[i];
  const value = req.query[key];

  conditions.push(sql`${sql(key)} = ${value}`);
}


let whereClause = conditions[0];

for (let i = 1; i < conditions.length; i++) {
  whereClause = sql`${whereClause} AND ${conditions[i]}`;
}

const results = await sql`
  SELECT * FROM record
  WHERE ${whereClause}
  order by id ASC
  LIMIT 5 OFFSET ${offset}
`;




        return res.status(200).json({records:results});
        }
        
    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
}
export async function updateRecord(req,res)
{
  const validrequest=z.object({
        type:z.enum(["income","expense"]),
        category:z.string().min(4).max(30),
        Notes:z.string().nullable(),
        Date:z.string().min(4).max(20),
        amount:z.number().positive()}).partial();

        const check=validrequest.safeParse({amount:req.body.amount,
            type:req.body.type,category:req.body.category,Notes:req.body.notes,
            Date:req.body.date
        })
        if(!check.success)
        {
            console.log(check.error);
            return res.sendStatus(422);
        }
        
        try
        {
            
          const filtered=Object.fromEntries(Object.entries(check.data).filter(([k,v])=>v!=undefined))
          console.log(filtered);
             let id=parseInt(req.body.id);
          let count=await sql `update record set ${sql(filtered)} where id=${id} AND deleted=false`
            if(count==0)
            {
                return res.status(422).send("Cannnot perform update operation on deleted field");

            }
            return res.sendStatus(200);
        }
        catch(e)
        {
            console.log(e);
            res.status(500).send("Updation failed");
        }
}
