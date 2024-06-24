const puerto = 3150;

const express = require('express')
const path = require('path');
const app = express();
const cors = require('cors')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const midb = require('./public/bd/usuarios.json')
const mibdp = require('./public/bd/productos.json')
const fs = require('fs')


app.use(express.static('public'))
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended:true}))//para cuando se procesan archivos mas complejos que un texto
app.use(cors())


// app.get('/app/productos', (req, res) => {
//     res.send('hola desde la ruta')
// })

app.get('/app/productos', (req, res) =>{
    const productos = mibdp

    return res.send(productos)
})

// INICIO JSON WEB TOKEN

app.post('/app/login', verificarUser, (req, res) => {
    const credenciales = {
        nombreus: req.body.nombreus,
        contraus: req.body.contraus
    }
    jwt.sign({ usuario: credenciales }, 'cualquiercosa', { expiresIn: '45s' }, (err, token) => {
        // res.json(token)
        const rutahtml = '/views/restringido.html'
        res.json({ token, rutahtml })
    })
    // console.log(credenciales);|
})

app.post('/app/restringido', verificatoken, (req, res) => {
    jwt.verify(req.token, 'cualquiercosa', (error, datos) => {
        if (error) {
            res.sendFile(path.join(__dirname, 'public/views', 'noautho.html'))
        } else {
            res.sendFile(path.join(__dirname, 'public/views', 'restringido.html'))
        }
    })
})

function verificarUser(req, res, next){

    const credenciales = {
        nombreus: req.body.nombreus,
        contraus: req.body.contraus 
    }

    if (!credenciales.nombreus && !credenciales.contraus)  res.sendStatus(400)

    let user = midb.find(user=> user.name === credenciales.nombreus)
    if(!user) return res.status(401).send("nombre")
    if(user.password != credenciales.contraus ) return res.send("contraseña no valida") 
    

    next()

}








//middelware para verificar token
function verificatoken(req, res, next) {
    const portadora = req.headers['authorization']
    if (portadora) {
        let tokenportadora = portadora.split(' ')[1]
        req.token = tokenportadora
        next()
    } else {
        res.status(403)
    }
}

// FIN JSON WEB TOKEN

// INICIO MULTER
//middelware para hacer uso de multer
const almacenamiento = multer.diskStorage({
    destination: (req,file,destino)=>{
        destino(null,'public/img')
    },
    filename: (req,file,nombre)=>{
        nombre(null,`${file.originalname}`)
    }
})

const subirArchivo = multer({storage: almacenamiento})


//endpoint cargar imagen
app.post('/app/productos', subirArchivo.single('imagenp'),(req, res, next) =>{
    
    const idp = req.body.idp,
    nombrep = req.body.nombrep,
    descripcionp = req.body.descripcionp,
    preciop = req.body.preciop,
    cantidadp = req.body.cantidadp,
    imagenp = req.file

    const datos = {
        id:idp,
        nombre:nombrep,
        descripcion:descripcionp,
        precio:preciop,
        cantidad:cantidadp,
        imagen:imagenp.path
    }
    mibdp.push(datos)

    let datosJson = JSON.stringify(mibdp)

    try{
        fs.writeFileSync('./public/bd/productos.json', datosJson)
        
    }catch{
        console.log('error en los datos')
    }


    res.send(mibdp)

})

//endpoint para cargar la imagen

app.post('/archivo', subirArchivo.single('imagen'),(req,res,next)=>{
    const archivo = req.file
    if (!archivo) {
        res.send(400)
        return next(error)
    } else {
        // res.send(archivo)
        res.sendFile(path.resolve(__dirname, `public/img/${archivo.filename}`))
    }
})

//endpint para cargar las n imagenes
app.post('/archivos', subirArchivo.array('imagenes',3),(req,res,next)=>{
    const archivo = req.files
    if (!archivo) {
        res.send(400)
        return next(error)
    } else {
        res.send(archivo)
        // res.sendFile(path.resolve(__dirname, `public/img/${archivo.filename}`))
    }
})

// FIN MULTER


app.listen(puerto, () => {
    console.log(`servidor listo y escuchando en http://localhost:${puerto}`);
})