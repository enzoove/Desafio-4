const fs = require('fs');
const path = require('path');
const { stringify } = require('querystring');
const { Router } = require('express');

const filePath = path.resolve( __dirname,'../../productos.json' );
console.log( filePath );

const rutaProductos = Router();

rutaProductos.get( '/', async( req,res )=>{
    const content = await fs.promises.readFile( filePath, 'utf-8' );
    const arrayProducts = JSON.parse( content );

    res.json( arrayProducts );
} )

rutaProductos.get( '/:id', async( req,res )=>{
    const id = req.params.id;
    console.log( `ID INGRESADO: ${id}` );
    const content = await fs.promises.readFile( filePath, 'utf-8' );
    const arrayProducts = JSON.parse( content );

    const indice = arrayProducts.findIndex( (product) => product.id == id );
    
    if( indice<0 )
    {
        return res.status(404).json( {error: `No se encontro ningun producto asociado al ID ${id}`} );
    }
    else
    {
        res.json( arrayProducts[indice] );
    }
} )

rutaProductos.post( '/', async( req,res )=>{
    const content = await fs.promises.readFile( filePath, 'utf-8' );
    const arrayProducts = JSON.parse( content );
    
    const newData = req.body;
    const { title, price, thumbnail } = req.body;
    
    if( !title || !price || !thumbnail )
    {
        return res.status(400).json( {error: `Campos invalidos.`} )
    }

    const newProduct ={
        title: title,
        price: price,
        thumbnail: thumbnail,
        id: arrayProducts[arrayProducts.length-1].id+1
    }

    // Verifico que el producto no este repetido
    let estaRepetido = false;
    arrayProducts.forEach( (product)=>{
        if( product.title == title )
        {
            estaRepetido = true;
            return res.status(400).json( {error: `Ya existe un producto con el nombre ${title}`} );
        }
    } )

    if( !estaRepetido )
    {
        arrayProducts.push( newProduct );
        const data = JSON.stringify( arrayProducts, null, '\t' );
        await fs.promises.writeFile( filePath, data );
        console.log( `Se agrego un producto con el ID ${newProduct.id}` );
        res.json( arrayProducts[arrayProducts.length-1]  );
    }

} )

rutaProductos.put( '/:id', async( req,res )=>{
    const id = req.params.id;
    const newData = req.body;
    console.log( `ID ingresado: ${id}` );
    const content = await fs.promises.readFile( filePath, 'utf-8' );
    const arrayProducts = JSON.parse( content );

    const { title, price, thumbnail } = req.body;
    
    if( !title || !price || !thumbnail )
    {
        return res.status(400).json( {error: `Campos invalidos.`} )
    }

    const indice = arrayProducts.findIndex( (product) => product.id == id );
    
    if( indice<0 )
    {
        return res.status(404).json( {error: `No se encontro ningun producto asociado al ID ${id}`} );
    }
    else
    {
        newData.id = id;
        arrayProducts[indice] = newData;
        const data = JSON.stringify( arrayProducts, null, '\t' );
        await fs.promises.writeFile( filePath, data );
        console.log( `Se edito el producto con ID ${id}` );
        res.json( {msg: `Se edito el producto con ID ${id}`} );
    }

} )

rutaProductos.delete( '/:id', async( req,res )=>{
    const id = req.params.id;
    const content = await fs.promises.readFile( filePath, 'utf-8' );
    const arrayProducts = JSON.parse( content );

    const indice = arrayProducts.findIndex( (product) => product.id == id );
    
    if( indice<0 )
    {
        return res.status(404).json( {error: `No se encontro ningun producto asociado al ID ${id}`} );
    }
    else
    {
        arrayProducts.splice( indice, 1 );
        const data = JSON.stringify( arrayProducts, null, '\t' );
        await fs.promises.writeFile( filePath, data );
        console.log( `Se elimino el producto con ID ${id}` );
        res.json( {msg: `Se elimino correctamente el producto con ID ${id}`} );
    }
} ) 

module.exports = rutaProductos;
