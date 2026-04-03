import Express from "express"

import { createUser } from "../../Handlers/UserMangament/userhandler.js"
const userRouter=Express.Router()
userRouter.post("/create",createUser);
export default userRouter;