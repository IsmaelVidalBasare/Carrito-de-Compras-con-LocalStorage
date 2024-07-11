//Variables
const carrito = document.querySelector('#carrito'); 
const contenedorCarrito = document.querySelector('#lista-carrito tbody'); 
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito'); 
const listaCursos = document.querySelector('#lista-cursos');

let articulosCarrito = [];


cargarEventListeners();
function cargarEventListeners(){
    //cuando agregas un curso presionando el boton "Agregar al Carrito"
    listaCursos.addEventListener('click', agregarCurso); 

    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso); 

    //Muestra los cursos del local Storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito=JSON.parse(localStorage.getItem('carrito')) || []; 
   
        carritoHTML(); 
    }); 

    //Vaciar el carrito de compras
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; //reseteamos el arreglo
        
        limpiarHTML(); 

    })
}

//Funciones 
function agregarCurso(e){
    e.preventDefault();

    if(e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
    
}

//Elimina un curso del carrito
function eliminarCurso(e) {
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id'); 

        //Eliminar del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter ( curso => curso.id !== cursoId);  

        carritoHTML(); //Iteramos sobre el carrito y mostrar su HTML 

        } 
    }

//Lee el contenido del HTML al que le dimos click y extrae la infomracion del curso
function leerDatosCurso(curso) {
    //console.log(curso); 

    //creamos un objeto con el contenido del curso actual 
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    //revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id ); 
    if(existe){
        //actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            if (curso.id === infoCurso.id){
                curso.cantidad++;
                return curso; //retorna el objeto actualizado
            } else {
                return curso; //retorna los objetos que no son los duplicados 
            }
        });
        articulosCarrito = [...cursos]; 
    } else {
        //agrega elementos al arreglo de carritos 
        articulosCarrito = [...articulosCarrito, infoCurso]; 
    }

    console.log(articulosCarrito); 

    carritoHTML(); 
}

//Muestra el Carrito de compras en el HTML
function carritoHTML(){

    //Limpiar el HTML
    limpiarHTML(); 

    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const { imagen, titulo, precio, cantidad, id} = curso; 
        const row = document.createElement('tr');
        row.innerHTML = `

        <td>
        <img src="${imagen}" width="100">
        </td>
        <td>${titulo}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${id}"> X </a> 
        </td>

        `;

        //Agrerag el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row); 

    });

    //Agregar el carrito de compras al storage
    sincronizarStorage();

}

function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}


//Elimina los cursos del tbody

function limpiarHTML(){

    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild); 
    }

}