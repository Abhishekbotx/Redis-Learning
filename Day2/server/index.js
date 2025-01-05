import express from "express";
import { getProductDetail, getProducts } from "./apis/api.js";
import Redis, { createClient } from 'redis';
import { cachedProductsData, rateLimiter } from "./middlewares/middleware.js";

const app = express();
const PORT=3000;
export const client=createClient({
    socket: {
        host: '127.0.0.1', 
        port: 6380,  
    }
})


let count=1;
app.get('/',rateLimiter(15,60),async(req,res)=>{
    //request from ip count;
    res.send(`server started successfully `)
})

app.get('/products',cachedProductsData('products'),async(req,res)=>{
    try {
        console.log('route was hit')
        
        const products=await getProducts();
        console.log('products:',products);
        
        await client.set("products",JSON.stringify(products))

        return res.json({
            products
        })
    } catch (error) {
        console.error('error:',error)
    }
})
app.get('/product/:id',async(req,res)=>{
    try {
            console.log('route was hit');
            const productId=req.params.id
            const key=`product:${productId}`
            console.log('product id:',productId);
            const isExist=await client.exists(key);
            console.log('isexist:',isExist)
            if(isExist){
                console.log("Get from cache");
                const product=await client.get(key);
                return res.json({
                    products:JSON.parse(product)
                });
            }
            const product=await getProductDetail(productId);
            console.log('product:',product);
            
            await client.set(key,JSON.stringify(product.product))
            return res.json({
                product
            })
    } catch (error) {
            console.error('error:',error)
    }
})
async function startServer() {
    try {
        await client.connect();
        console.log("Connected to Redis");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startServer();
