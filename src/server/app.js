import Express from "express";
import sql from "./db.js"
import Authrouter from "./API/Routes/Auth/Auth.js"
  const app=Express();
  app.use(Express.json());
 
  app.use("/auth",Authrouter);
  app.get("/",async (req,res)=>{
    const [result]=await sql `select * from users`;
    console.log(result);
    res.json(result);

  })
  export default app;


