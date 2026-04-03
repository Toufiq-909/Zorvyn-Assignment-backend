import Express from "express";
import Authrouter from "./API/Routes/Auth/Auth.js"
import userRouter from "./API/Routes/UserMangament/User.js";
  const app=Express();
  app.use(Express.json());
 
  app.use("/auth",Authrouter);
  app.use("/user",userRouter)

  export default app;


