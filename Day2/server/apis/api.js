export const getProducts =()=>{
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(
                [
                    {
                        id: 1,
                        name: "Product 1",
                        price: 100
                    },
                    {
                        id: 2,
                        name: "Product 2",
                        price: 150
                    }
                ]
            );
        }, 1000);
    });
}
export const getProductDetail =(id)=>{
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                product: 
                    {
                        id: id,
                        name: `Product ${id}`,
                        price: Math.floor(Math.random()*id*100)
                    }
                
            });
        }, 1000);
    });
}