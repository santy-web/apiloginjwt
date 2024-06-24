function traerProducto(){
    
    url = '/app/productos'

    fetch(url)
        .then(respuesta => respuesta.json())
            .then(datos =>{
                let datosjson = datos
                console.log(datosjson)

                let rutaimg = datosjson[0].imagen
                let ruta = rutaimg.slice(6)
                let img = document.getElementById('imgp')
                img.src = ruta

                let nombrep = document.getElementById('nombrep')
                nombrep.textContent = datosjson[0].nombre
                let descripcionp = document.getElementById('descripcionp')
                descripcionp.textContent = datosjson[0].descripcion
                let preciop = document.getElementById('preciop')
                preciop.textContent = datosjson[0].precio
                let cantidadp = document.getElementById('cantidadp')
                cantidadp.textContent = datosjson[0].cantidad
            })
}
