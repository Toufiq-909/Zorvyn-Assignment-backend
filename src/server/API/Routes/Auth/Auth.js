import Express from "express"
import { login } from "../../Handlers/Auth/Authhandler.js";
const Authrouter=Express.Router();
Authrouter.post("/login",login);
export default Authrouter;