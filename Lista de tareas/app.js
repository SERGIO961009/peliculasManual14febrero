const input = document.getElementById('ingresar-tarea');
const boton = document.querySelector('button');
const listaDeTarea = document.getElementById('lista-de-tareas');

function agregarTarea(){
  if(input.value.trim()){   // <-- aquí está el if con trim
    let tareaNueva = document.createElement('div');
    tareaNueva.classList.add('tarea');

    // Texto ingresado por el usuario
    let texto = document.createElement('p');
    texto.innerText = input.value.trim();
    tareaNueva.appendChild(texto);

    // Crear y agregar contenedor de Iconos
    let iconos = document.createElement('div');
    iconos.classList.add('iconos');
    tareaNueva.appendChild(iconos); 

    // Icono completar
    let completar = document.createElement('i');
    completar.classList.add('bi','bi-check-circle-fill','icono-completar');
    completar.addEventListener('click', completarTarea);

    // Icono eliminar
    let eliminar = document.createElement('i');
    eliminar.classList.add('bi','bi-trash3-fill','icono-eliminar');
    eliminar.addEventListener('click', eliminaTarea);

    // Icono editar
    let editar = document.createElement('i');
    editar.classList.add('bi','bi-pencil-fill','icono-editar');
    editar.addEventListener('click', editarTarea);

    iconos.append(completar, eliminar, editar);

    // Agregar tarea a la lista
    listaDeTarea.appendChild(tareaNueva);

    // Limpiar input
    input.value = '';
  }else{
    alert('Por favor ingresa una tarea');
  }
}

function completarTarea(e){
  let tarea = e.target.closest('.tarea');
  tarea.classList.toggle('completada');
}

function eliminaTarea(e){
  let tarea = e.target.closest('.tarea');
  tarea.remove();
}

function editarTarea(e){
  let tarea = e.target.closest('.tarea');
  let texto = tarea.querySelector('p');

  // Crear input con el texto actual
  let inputEditar = document.createElement('input');
  inputEditar.type = 'text';
  inputEditar.value = texto.innerText;
  inputEditar.classList.add('input-editar');

  // Reemplazar el <p> por el input
  tarea.replaceChild(inputEditar, texto);

  // Guardar cambios al presionar Enter o perder foco
  inputEditar.addEventListener('keydown', (ev)=>{
    if(ev.key === 'Enter'){
      guardarEdicion(tarea, inputEditar);
    }
  });

  inputEditar.addEventListener('blur', ()=>{
    guardarEdicion(tarea, inputEditar);
  });

  inputEditar.focus();
}

function guardarEdicion(tarea, inputEditar){
  let nuevoTexto = document.createElement('p');
  nuevoTexto.innerText = inputEditar.value.trim() || "Tarea sin nombre";
  tarea.replaceChild(nuevoTexto, inputEditar);
}

// Eventos
boton.addEventListener('click', agregarTarea);
input.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    agregarTarea();
  }
});
