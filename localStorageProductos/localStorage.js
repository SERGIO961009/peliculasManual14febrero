// Variables globales

let email = document.querySelector("#inputEmail");
let password = document.getElementById("inputPassword");
let btnGuardar = document.querySelector("#btnGuardar");
let usuarios = {
    admin : "admin123@gmail.com",
    demo : "admin123"
}

//Agregar evento al boton guardar 

btnGuardar.addEventListener("click", ()=>{
    validForm();
});

//Evento para cargar datos iniciales
document.addEventListener("DOMContentLoaded", ()=>{
    localStorage.setItem("usuarios",JSON.stringify(usuarios));
    console.log("Usuario por defecto guardados");
})

//Funcion para validar datos del usuario 
function validForm(){
    if(email.value && password.value){
        alert("Todo bien")
       
    }  
    else{alert("Todos los campos son obligatorios");
}} 