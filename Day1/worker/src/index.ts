
import { createClient } from "redis";


const client = createClient({
  socket: {
    host: '127.0.0.1', 
    port: 6380,        
}

})

const start =async  ()=>{
    await client.connect()
    while(1){
        const response=await client.brPop("problems",0)
        console.log('response:',response)
        await new Promise((resolve)=>setTimeout(resolve,3000))
        console.log ("Processed users submission")
    }
}
 start()