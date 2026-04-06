import Express from "express"
import { login,changepassword } from "../../Handlers/Auth/Authhandler.js";
const Authrouter=Express.Router();
Authrouter.post("/login",login);
Authrouter.post("/change",changepassword);
export default Authrouter;