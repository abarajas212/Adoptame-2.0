// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnModificar").addEventListener('click', modificarAnimal, false);
/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app;

var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var nombreAnimal; // Nombre del animal que se recoge por pantalla
var idProtectora //Id de la protectora que se recogera de la variable que se carga al hacer login
var idFoto //Nombre de la foto
var ip;
var idAnimal;


function onDeviceReady() {
    // Controlar la pausa de Cordova y reanudar eventos
    document.addEventListener('pause', onPause.bind(this), false);
    document.addEventListener('resume', onResume.bind(this), false);

    // Carga los controladores de la camara
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;

    // TODO: Cordova se ha cargado. Haga aquí las inicializaciones de Cordova y Framework 7.
    app = new Framework7({
        // App root element
        root: '#app',
        // App Name
        name: 'Adoptame2.0',
        // App id
        id: 'adoptame',
        // Enable swipe panel
        panel: {
            swipe: 'left',
        },
        // Add default routes
        routes: [
            {
                path: '/about/',
                url: 'about.html',
            },
        ],
        // ... other parameters
    });

    var mainView = app.views.create('.view-main');
    ip = window.sessionStorage.getItem("IP");

    idAnimal = window.sessionStorage.getItem("idAnimal");

    cargarAnimal();
};

/**
 * Funcion que carga los datos del animal para modificarlo
 */
function cargarAnimal() {

    //Recupera el id del animal
    idAnimal = window.sessionStorage.getItem("idAnimal");;

    //Consulta datos animal
    var queryString =
        'http://' + ip + '/Adoptame/public/api/animales/detalleAnimal/' + idAnimal;

    $.getJSON(queryString, function (results) {

        //Cargar pantalla datos animal

        $('#nombreAnimal').val(results[0].nombre);
        $('#descripcion').html(results[0].descripcion);
        $('#' + results[0].especie).prop("checked", true);
        $('#' + results[0].sexoAnimal).prop("checked", true);
        $('#' + results[0].tamanio).prop("checked", true);
        $('#' + results[0].estado).prop("checked", true);

    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
        alert("Error en el sistema, contacte con el administrador");
    });

}

/**
 * Funcion que añade un animal nuevo, se activa al pulsar el boton "btnAniadir"
 */
function modificarAnimal() {

    var radios = document.getElementsByTagName('input');
    var value, tam, estado, especie, sexo;

    idAnimal = window.sessionStorage.getItem("idAnimal");
    //Validar que nombre y descripción no estén vacíos.

    nombreAnimal = document.getElementById("nombreAnimal").value;

    if (validarCampoBlanco(nombreAnimal)) {
        app.dialog.alert('Introduzca un nombre para el animal', 'Error');
        return 1;
    }

    var descripcionAnimal = document.getElementById("descripcion").value;

    if (validarCampoBlanco(descripcionAnimal)) {
        app.dialog.alert('Introduzca una descripcionAnimal para el animal', 'Error');
        return 1;
    }

    //Recorre todos los inputs de la pantalla
    for (var i = 0; i < radios.length; i++) {
        //Si son radios y estan checked se revisa de que tipo son
        if (radios[i].type === 'radio' && radios[i].checked) {
            // Se guardan los valores seleccionados
            switch (radios[i].name) {
                case 'tamanio':
                    tam = radios[i].value;
                    break;
                case 'especie':
                    especie = radios[i].value;
                    break;
                case 'sexoAnimal':
                    sexo = radios[i].value;
                    break;
                case 'estado':
                    estado = radios[i].value;
                    break;
            }
        }
    }


    var queryStringR =
        'http://' + ip + '/Adoptame/public/api/animales/modificarAnimal';

     $.post(queryStringR, {

            idAnimal: idAnimal,
            especie: especie,
            sexo: sexo,
            tamanio: tam,
            estado: estado,
            nombre: nombreAnimal,
            descripcion: descripcionAnimal
     });

     alert("Animal modificado");
     window.location.replace("protIndex.html");
    
}


/**
 * Funcion que comprueba si el campo esta en blanco
 * @param {any} campo
 */
function validarCampoBlanco(campo) {

    if (campo == "" || campo.length == 0) {
        return true;
    } else {
        return false;
    }
}
/**
 * Funcion que redirecciona a la pagina de inicio
 */
function redireccionar() {
    window.location.replace("protIndex.html");
};

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};