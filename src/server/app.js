import Express from "express";
import Authrouter from "./API/Routes/Auth/Auth.js"
import userRouter from "./API/Routes/UserMangament/User.js";
import RecordRouter from "./API/Routes/Record/record.js";
  const app=Express();
  app.use(Express.json());
 
  app.use("/auth",Authrouter);
  app.use("/user",userRouter)
  app.use("/record",RecordRouter)
  export default app;


