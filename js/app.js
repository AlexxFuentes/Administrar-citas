//Variables
//Campos del formulario
const nombre_mascota_input = document.querySelector('#mascota');
const propietario_input = document.querySelector('#propietario');
const telefono_input = document.querySelector('#telefono');
const fecha_input = document.querySelector('#fecha');
const hora_input = document.querySelector('#hora');
const sintomas_input = document.querySelector('#sintomas');

//UI
const formulario = document.querySelector('#nueva-cita');
const Contenedor_citas = document.querySelector('#citas');
let editando;

//EventListeners
eventListeners();
function eventListeners(){
    nombre_mascota_input.addEventListener('input', datos_cita);
    propietario_input.addEventListener('input', datos_cita);
    telefono_input.addEventListener('input', datos_cita);
    fecha_input.addEventListener('input', datos_cita);
    hora_input.addEventListener('input', datos_cita);
    sintomas_input.addEventListener('input', datos_cita);

    formulario.addEventListener('submit', nueva_cita);
}
//Clases
class Citas {
    constructor(){
        this.citas = [];
    }

    agregar_citas(cita){
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id);
    }

    editar_cita(cita_actualizaza){
        this.citas = this.citas.map( cita => cita.id === cita_actualizaza.id ? cita_actualizaza : cita);
    }
}

class UI {

    imprimir_alerta(mensaje, tipo){
        const div_mensaje = document.createElement('div');
        div_mensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        if(tipo === 'error'){
            div_mensaje.classList.add('alert-danger');
        }else{
            div_mensaje.classList.add('alert-success');
        }
        div_mensaje.textContent = mensaje;

        //agregar al HTML
        document.querySelector('#contenido').insertBefore(div_mensaje, document.querySelector('.agregar-cita'));

        setTimeout(()=> {
            div_mensaje.remove();
        }, 3000)
    }

    mostrar_citas({citas}){
        this.limpiarHTML();
        
        citas.forEach( cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // scRIPTING DE LOS ELEMENTOS...
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.innerHTML = `${mascota}`;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: </span> ${sintomas}`;

            // Agregar un botón de eliminar...
            const btnEliminar = document.createElement('button');
            btnEliminar.onclick = () => eliminar_cita(id); // añade la opción de eliminar
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'

            // Agregar un botón de editar...
            const btnEditar = document.createElement('button');
            btnEditar.onclick = () => cargar_edicion(cita);

            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'

            // Agregar al HTML
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            Contenedor_citas.appendChild(divCita);
        });
    }

    limpiarHTML(){
        while(Contenedor_citas.firstChild){
            Contenedor_citas.removeChild(Contenedor_citas.firstChild);
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();

//Obj
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}

//funciones 
function datos_cita(e){
    citaObj[e.target.name] = e.target.value;
}

function nueva_cita(e) {
    e.preventDefault();
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    //Validacion de los campos del formulario
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimir_alerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if(editando){//Modo edicion                
        ui.imprimir_alerta('Se edito correctamente');
        administrarCitas.editar_cita({...citaObj});
        formulario.querySelector('button[type="submit"]').textContent = 'CREAR CITA';
        editando = false;
    }else{//Nueva cita
        citaObj.id = Date.now();//Crear un id unico
        //crear una nueva cita
        administrarCitas.agregar_citas({...citaObj});        
        ui.imprimir_alerta('Se agrego correctamente');
    }
    //reiniciar el obj para la validacion
    reiniciarObjeto();
    //reiniciar el formulario
    formulario.reset();
    //Mostrar el HTML de las citas
    ui.mostrar_citas(administrarCitas);
}

function eliminar_cita(id){
    //Eliminar la cita
    administrarCitas.eliminarCita(id);
    //Mostrar mensaje
    ui.imprimir_alerta('La cita se elimino correctamente.');
    //refrescar las citas
    ui.mostrar_citas(administrarCitas);
}

function cargar_edicion(cita){
    //Editar cita
    const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    //mostrar informacion en el formulario HTML
    nombre_mascota_input.value = mascota;
    propietario_input.value = propietario;
    telefono_input.value = telefono;
    fecha_input.value = fecha;
    hora_input.value = hora;
    sintomas_input.value = sintomas;

    //Capturar los valores a editar
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    editando = true;
}

function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.echa = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}