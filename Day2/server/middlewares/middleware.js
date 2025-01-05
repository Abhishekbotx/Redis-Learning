import { client } from "../index.js";

export const cachedProductsData =(key)=>{
    return async (req, res, next) => {
        // let products = await client.get('products');
        // const isExist = await client.exists(key);
        const data = await client.get(key);
        console.log('isexist:', data)
        if (data) {
            console.log("Get from cache");
            return res.json({
                products: JSON.parse(data)
            });
        }
    
        next()
    }    
}

export const rateLimiter=(limit,timer)=>async(req,res,next)=>{
    const clientIP=req.headers["x-forwarded-for" || req.socket.remoteAddress ];
        const key=`${clientIP}:request_count`;
        const requestCount=await client.incr(key);
        const limit=10;
        const timer=50;
        // console.log('requestCount:',requestCount);
        
        if(requestCount===1){
            client.expire(key, timer)
        }
        // console.log('IP Address:',clientIP);
        const ttl=await client.ttl(key)
        if(requestCount>limit){
           return res.status(429).send(`Too many requests,Please try after ${ttl} seconds`)
        }


        next();

}