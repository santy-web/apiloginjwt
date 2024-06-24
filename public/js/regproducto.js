pedirId()

document.getElementById('registrarp').addEventListener('click',(e)=>{
    e.preventDefault()
    postDatos()
})

function pedirId(){
    
    let url = '/app/productos'

    fetch(url)
        .then(respuesta => respuesta.json())
            .then(datos => {
                const tamano = datos.length
                const ultimo = datos[tamano-1]
                const ultid = parseInt(ultimo.id) + 1 
                let id = document.getElementById('idp')
                id.value = ultid
                id.readOnly = true
        })

    }

    async function postDatos(){
        const formulario = document.getElementById('enviardatos')
        let datos = new FormData(formulario)
    
        let url = '/app/productos'
    
        const cont = {
            method: 'POST',
            body: datos
        }
    
        try{
            let peticion = await fetch(url, cont)
            if(!peticion.ok){
                throw new Error('Hubo un problema a realizar la peticion')
            }let = valore = peticion.json()
            alert('Producto registrado')
            document.getElementById('enviardatos').reset()
            pedirId()
        }catch{
            console.log('Erro en la peticion')
        }
    }