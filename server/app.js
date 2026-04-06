import Express from "express";
import Authrouter from "./API/Routes/Auth/Auth.js"
import userRouter from "./API/Routes/UserMangament/User.js";
import RecordRouter from "./API/Routes/Record/record.js";
import limiter from "./RateLimit/ratelimit.js";
import { findRole } from "./RateLimit/finduser.js";
  const app=Express();
  app.use(Express.json());

  app.use("/auth",Authrouter);
app.use("/",findRole,limiter)
  app.use("/user",userRouter)
  app.use("/record",RecordRouter)
  export default app;


