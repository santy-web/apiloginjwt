const btnsalir = document.getElementById('btnsalir')

btnsalir.addEventListener('click',()=>{
    sessionStorage.clear()
    window.location.reload()
})