//Variables globales

let USUARIOS = {
    admin: "admin123",
    usuario:"1234",
    demo: "demo"
};
let usuarioActual = null;
let peliculasGlobales = [];
let peliculaEnEdicion= null;

//Inicializacion de funciones
document.addEventListener("DOMContentLoaded", ()=>{
    inicializarApp();
    eventos();
    document.querySelector("#inputBuscar").addEventListener("input", filtrarPeliculas);

    document.querySelector("#selectGenero").addEventListener("change", filtrarPeliculas);
});

function inicializarApp(){
    //Cargar usuario registrado en local
    cargarUsuarioRegistrados();

    //Verificar si hay un usuario logeado
    let userLogged = localStorage.getItem("usuarioLogueado");
    if(userLogged){
        usuarioActual = JSON.parse(userLogged);
        mostrarDashboard();
    } 
    //Cargar peliculas de ejemplo

    if(!localStorage.getItem("peliculas")){
        cargarDatosEjemplo();
    }
};

function cargarUsuarioRegistrados(){
    //Obtener usuarios de localStorage y cargar a la variable USUARIOS
    let usuarioRegistrados = JSON.parse(localStorage.getItem("usuarioRegistrados"));
    if(usuarioRegistrados){
        Object.assign(USUARIOS, usuarioRegistrados);
    }
}

function eventos(){
    document.querySelector("#formLogin").addEventListener("submit", login);
    //Boton logout
    document.querySelector("#btnSalir").addEventListener("click", logout);
    //Boton Registro
    document.querySelector("#formRegister").addEventListener("submit",register);
    //Boton Guardar
    document.querySelector("#btnGuardarPelicula").addEventListener("click",guardarPelicula);
        
}

function login(e){
    e.preventDefault();
    let user = document.querySelector("#inputUser").value;
    let password = document.querySelector("#inputPassword").value;

    if(USUARIOS[user] && USUARIOS[user]=== password){
        usuarioActual = user; 
        localStorage.setItem("usuarioLogueado", JSON.stringify(user));
        mostrarDashboard();
        document.querySelector("#formLogin").reset();
    }else{
        alert("El usuario y contraseña no son validos")
    };
};

function mostrarDashboard(){
    document.querySelector("#loginSection").style.display = "none";
    document.querySelector("#btnEntrar").style.display = "none";
    document.querySelector("#mainContent").style.display = "block";
    document.querySelector("#btnSalir").style.display = "block";
    document.querySelector(".userLogged").textContent =  usuarioActual;
    //Cargar peliculas
    cargarPeliculas();
}

function mostrarLogin(){
    document.querySelector("#loginSection").style.display = "flex";
    document.querySelector("#btnEntrar").style.display = "block";
    document.querySelector("#mainContent").style.display = "none";
    document.querySelector("#btnSalir").style.display = "none";
        
}

function logout(){
    let confirmar = confirm("¿Deseas cerrar sesion?");
    if(confirmar){
        usuarioActual = null;
        localStorage.removeItem("usuarioLogueado");
        mostrarLogin();
        document.querySelector("#formLogin").reset();
    }
}

function register(e){
    e.preventDefault();
    let nombre = document.querySelector("#inputNombre").value.trim();
    e.preventDefault();
    let email = document.querySelector("#inputEmail").value.trim();
    e.preventDefault();
    let usuario = document.querySelector("#inputUserReg").value.trim();
    e.preventDefault();
    let password = document.querySelector("#inputPasswordReg").value.trim();
    e.preventDefault();
    let confirmPassword = document.querySelector("#inputConfirmPassword").value.trim();

    //Validaciones 
    if(nombre && email && usuario && password && confirmPassword){
        //Verificar el usuario registrado
        if(USUARIOS[usuario]){
            alert("El usuario ya existe, por favot elige otro")
            return
    }
        USUARIOS[usuario] = password; //Agregar el usuario a la lista
        //Guardar en localStorage

        let usuarioRegistrados = JSON.parse(localStorage.getItem("usuarioRegistrados")) || {};
        usuarioRegistrados[usuario] = password;
        localStorage.setItem("usuarioRegistrados", JSON.stringify(usuarioRegistrados));

        //Exito
        alert("Usuario" + usuario + "registrado con exito, inicia sesion");

        //Limpiar formulario de registro
        document.querySelector("#formRegister").reset();
        document.querySelector("#login-tab").click();
        
    }else{
        alert("Por favor completa todos los campos")
        return
    }

    if(usuario.length < 4){
        alert("El usuario debe tener contener minimo 4 caracteres")
        return
    }

    if(password.length< 4){
        alert("la contraseña debe tener contener minimo 4 caracteres")
        return
    }

    if(usuario.length < 6){
        alert("El usuario debe tener contener minimo 4 caracteres")
        return
    }

    if(password !== confirmPassword){
        alert("Las contraseñas no coinciden")
        return
    }
}

/*Peliculas de ejemplo*/

function cargarDatosEjemplo(){
    let peliculasEjemplo = [{
        id:1,
        titulo:"Inception",
        genero:"Ciencia Ficcion",
        director:"Christopher Nolan",
        ano: 2010,
        calificacion:8.8,
        descripcion:"Al igual que en trabajos anteriores, Nolan decidió contar con la participación de Hans Zimmer ",
        imagen: "https://image.tmdb.org/t/p/w300_and_h450_face/xgPGDEKkBrXhPaNmwIlf8e2RCMk.jpg"
    },
    {
        id:2,
        titulo:"Rapido y Furioso",
        genero:"Accion",
        director:"Toreto",
        ano: 2002,
        calificacion:10,
        descripcion:"Rápido y Furioso es una película de acción de 2001 que sigue a un oficial de policía ",
        imagen: "https://media.fstatic.com/erHTLfaQojktDg3s1S5WNMmco2I=/322x478/smart/filters:format(webp)/media/movies/covers/2011/12/0c0bac9ac463dd53a751e39eb13ac0f5.jpg"
    },
    {
        id:3,
        titulo:"Rapido y Furioso 2",
        genero:"Accion",
        director:"Toreto",
        ano: 2004,
        calificacion:10,
        descripcion:"Rápido y Furioso 2 sigue a Brian O'Conner, un ex-policía que se une a su amigo Roman Pearce",
        imagen: "https://es.web.img2.acsta.net/medias/nmedia/18/68/78/98/20073083.jpg"
    }
];

//Guardar el local storage

localStorage.setItem("peliculas", JSON.stringify(peliculasEjemplo));

}

//Cargar peliculas de ejemplo
function cargarPeliculas(){
    let peliculas = localStorage.getItem("peliculas");
    peliculasGlobales = peliculas ? JSON.parse(peliculas) :[];
    //Renderizar en el grid las peliculas
    renderizarGrid(peliculasGlobales);
    renderizarSlider();
};

//Renderizar peliculas

function renderizarGrid(pelis){
    let grid = document.querySelector("#gridPeliculas");
    let sinResultado = document.querySelector("#sinResultados");

    if(pelis.length === 0){
        grid.innerHTML = "" ;
        sinResultado.style.display = "block";
        return;
    }
    sinResultado.style.display = "none"; 
    grid.innerHTML = pelis.map(p =>
        `
            <div class="col-md-6 col-lg-4 col-xl-3">
                <div class= "movie-card fade-in">
                    <img src="${p.imagen}" class="movie-image" onerror="this.src='https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg'">
                    <div class="movie-content">
                        <h5 class = "movie-title">${p.titulo}</h5>
                        <span class="movie-genero">${p.genero}</span>
                        <div class="movie-meta"><b>${p.ano}</b> - ${p.director}</div>
                        <div class="movie-rating">🌟${p.calificacion}/10</div>
                        <div class="movie-description">🌟${p.descripcion}/10</div>
                        <div class="movie-actions">
                            <button class="btn btn-info" onclick="verDetalles(${p.id})">👁️Detalles</button>
                            <button class="btn btn-warning" onclick="editarPelicula(${p.id})">🖊️Editar</button>
                            <button class="btn btn-danger" onclick="eliminarPelicula(${p.id})">✖️Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    ).join("");
    
}

//Agregar o editar peliculas

function guardarPelicula(){
    //Obtener los datos del formulario
    let titulo = document.querySelector("#inputTitulo").value;
    let genero = document.querySelector("#inputGenero").value;
    let director = document.querySelector("#inputDirector").value;
    let ano = document.querySelector("#inputAno").value;
    let calificacion = document.querySelector("#inputCalificacion").value;
    let descripcion = document.querySelector("#inputDescripcion").value;
    let imagen = document.querySelector("#inputImagen").value;

    //Validar si estamos editando o agregando una pelicula
    if(peliculaEnEdicion){
        //Editando pelicula
        //Buscar pelicula en el array de peliculas
        let index = peliculasGlobales.findIndex((p)=>p.id === peliculaEnEdicion.id)
        //Si se encontró la pelicula guardar en el localStorage

        if(index !== -1 ){
            peliculasGlobales[index] = {
                ...peliculasGlobales[index], // Copiar informacion de pelicula
                titulo,genero,director,ano,calificacion,calificacion,descripcion,imagen
            }
            alert("pelicula actualizada con exito✅")
        }

    }else{
        //Agregando una nueva pelicula
        //Crear un objeto para guardar los datos de a nueva pelicula
        let nuevaPelicula ={
            id:Date.now(),
            titulo, genero,director,ano,calificacion,descripcion,imagen,fecha:new Date()
        }
        //Agregar peliculas a a lista de peliculas
        peliculasGlobales.unshift(nuevaPelicula);
        alert("Pelicula agregada exitosamente ✅");
    }
    //Agregar pelicula a localStorage
        localStorage.setItem("peliculas", JSON.stringify(peliculasGlobales));
        peliculaEnEdicion = null; //Limpiar variables en edicion
        //Cargar peliculas en el dashboard
        cargarPeliculas();

        //Esconder nodal
        bootstrap.Modal.getInstance(document.querySelector("#modalAdd")).hide();
        //Borrar los datos del nodal
        document.querySelector("#formPelicula").reset();
}

//Editar pelicula
function editarPelicula(id){
    //Encontrar la pelicula por el id para editarla
    let pelicula = peliculasGlobales .find((p)=> p.id ==id);
    
    //Si se encuentra pelicula llenamos el formulario
    if(pelicula ){
        peliculaEnEdicion = pelicula;

        //Seleccionamos los campos del formulario
        document.querySelector("#inputTitulo").value = pelicula.titulo;
        genero = document.querySelector("#inputGenero").value = pelicula.genero;
        director = document.querySelector("#inputDirector").value = pelicula.director;
        ano = document.querySelector("#inputAno").value = pelicula.ano;
        calificacion = document.querySelector("#inputCalificacion").value = pelicula.calificacion;
        descripcion = document.querySelector("#inputDescripcion").value = pelicula.descripcion;
        imagen = document.querySelector("#inputImagen").value = pelicula.imagen;
        //Cambiar titulo del nodal
        document.querySelector("#modalAddLabel").textContent = "Editar pelicula";

        //Abrir el nodal 
        let nodal = new bootstrap.Modal(document.querySelector("#modalAdd"));
        nodal.show();
    }
}

//Eliminar pelicula
function eliminarPelicula(id){
    //Confirmar si desea eliminar
    let confirmar = confirm("Deseas eliminar esta pelicula")
    if(confirmar){
        //Buscar las peliculas que no tenga el id que estamos buscando 
        peliculasGlobales = peliculasGlobales.filter((p=> p.id !== id));
        //Guardar las peliculas en localStorge 
        localStorage.setItem("peliculas", JSON.stringify(peliculasGlobales));
        //Actualizar el dashboard
        cargarPeliculas();
        //Mostrar confirmacion de eliminacion
        alert("Pelicula eliminada con exito✅")
    }
}

//Ver detalles de la pelicula
function verDetalles(id){
    let pelicula = peliculasGlobales.find((p=> p.id === id))

    //Si la encontró
    if(pelicula){
      document.querySelector("#detallesTitulo").textContent = pelicula.titulo;
      document.querySelector("#detallesGenero").textContent = pelicula.genero;
      document.querySelector("#detallesDirector").textContent = pelicula.director;
      document.querySelector("#detallesAno").textContent = pelicula.ano;
      document.querySelector("#detallesCalificacion").textContent = pelicula.calificacion;
      document.querySelector("#detallesDescripcion").textContent = pelicula.descripcion;
      document.querySelector("#detallesImagen").src = pelicula.imagen;

      //Abrir el nodal 
        let nodal = new bootstrap.Modal(document.querySelector("#modalDetalle"));
        nodal.show();
    }
}

//Funcion para renderizar tarjetas de peliculas slider
function renderizarSlider(){
    let carrusel = document.querySelector("#carruselMovies");
    carrusel.innerHTML = "";
    //Mostrar peliculas recientes
    let recientes = peliculasGlobales.slice(0,8);

    recientes.forEach((p)=>{
        let card = document.createElement("div");
        card.className = "slider-movie-card";
        card.innerHTML = `
        <img src="${p.imagen}" onerror="this.src='https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg'">
        <div class="slider-movie-info">
            <h6>${p.titulo}</h6>
            <small class="text-muted">${p.ano}</small>
        </div>
        `;
        card.addEventListener("click", ()=>verDetalles(p.id));
        carrusel.appendChild(card);
    })
}

//Movimiento del scroll
function scrollSlider(direccion){
    let  slider = document.querySelector("#carruselMovies");
    let scroll = 200;
    slider.scrollBy({
        left: direccion * scroll,
        behavior:"smooth"
    });
};

// Filtro

let displayProducts = () =>{
    let shopContent = document.getElementById("shopContent");

    // Aquí deberías recorrer peliculasGlobales, no asignarle innerHTML
    shopContent.innerHTML = peliculasGlobales.map(p =>
        `
            <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="movie-card">
                    <img src="${p.imagen}" class="movie-image" onerror="this.src='https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg'">
                    <div class="movie-content">
                        <h5 class="movie-title">${p.titulo}</h5>
                        <span class="movie-genero">${p.genero}</span>
                        <div class="movie-meta"><b>${p.ano}</b> - ${p.director}</div>
                        <div class="movie-rating">🌟${p.calificacion}/10</div>
                        <div class="movie-description">${p.descripcion}</div>
                    </div>
                </div>
            </div>
        `
    ).join("");
}

// === FILTRO DE PELICULAS ===
document.querySelector("#inputBuscar").addEventListener("input", filtrarPeliculas);
document.querySelector("#selectGenero").addEventListener("change", filtrarPeliculas);

function filtrarPeliculas() {
    let textoBuscar = document.querySelector("#inputBuscar").value.toLowerCase();
    let generoSeleccionado = document.querySelector("#selectGenero").value;

    let peliculasFiltradas = peliculasGlobales.filter(p => {
        let coincideTexto = p.titulo.toLowerCase().includes(textoBuscar) ||
                            p.director.toLowerCase().includes(textoBuscar);

        let coincideGenero = generoSeleccionado === "" || p.genero === generoSeleccionado;

        return coincideTexto && coincideGenero;
    });

    renderizarGrid(peliculasFiltradas);
}


