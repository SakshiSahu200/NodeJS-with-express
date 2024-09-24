const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename),
    'data',
    'cart.json');

module.exports = class Cart {
    // Note - instead of creating a constructor, we are using static method here
    static addProduct(id, productPrice) {
        //fetch previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(
                prod => prod.id === id
            );
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // Add new product / increase the quantity
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = existingProduct.qty + 1;
                // updatedProduct is replaced
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else{
                updatedProduct = { id: id, qty: 1 };
                // adding updatedProduct to the cart
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p , JSON.stringify(cart), err =>{
                if(err){
                    console.log(err);
                }
            })
        })
    }

    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, fileContent) => {
            if(err){
                return;
            }
        const updatedCart = {...fileContent};
        const product = updatedCart.products.find(prod => prod.id === id);
        const productQty = product.qty;
        updatedCart.products = updatedCart.products.filter(
            prod => prod.id !== id
        );
        updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * productQty);
        fs.writeFile(p, JSON.stringify(updatedCart), err =>{
            console.log(err);
        })    
    });
    }
};