
import rateLimit from "express-rate-limit"

 const limiter=rateLimit({windowMs:1*60*1000,max:(req)=>req.maxRequest,
    keyGenerator:(req)=>req.username,
    message:"To many requests"
})
 export default limiter