// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnModificar").addEventListener('click', modificarDatos, false);
/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app;

var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var nombreAnimal; // Nombre del animal que se recoge por pantalla
var idProtectora; //Id de la protectora que se recogera de la variable que se carga al hacer login
var idFoto; //Nombre de la foto
var protectora;
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

    protectora = window.sessionStorage.getItem("protectora");
   
    cargarDatosProtectora();
};

/**
 * Funcion que carga los datos del animal para modificarlo
 */
function cargarDatosProtectora() {


    //Consulta datos animal
    var queryString =
        'http://' + ip + '/Adoptame/public/api/protectora/detalleProtectora/' + protectora;

    $.getJSON(queryString, function (results) {

        //Cargar pantalla datos animal

        $('#name').val(results[0].nombreProtectora);
        $('#descripcion').html(results[0].descripcionProtectora);
        $('#emailProtectora').val(results[0].emailProtectora);
        $('#telefono').val(results[0].telefonoProtectora);
        $('select').val(results[0].ciudadProtectora);

    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
        alert("Error en el sistema, contacte con el administrador");
    });

}

/**
 * Funcion que añade un animal nuevo, se activa al pulsar el boton "btnAniadir"
 */
function modificarDatos() {

    var flagValidacionesBlanco, flagValidacionesEspacio, flagValidacionTelefono;

    //Recoge nombre 
    var nombre = document.getElementById("name").value;

    if (flagValidacionesBlanco = validarCampoBlanco(nombre)) {
        app.dialog.alert('Introduzca un nombre', 'Error');
        return null;
    }
    //Recoge email
    var email = document.getElementById("emailProtectora").value;

    if (flagValidacionesBlanco = validarCampoBlanco(email)) {
        app.dialog.alert('Introduzca un email', 'Error');
        return null;
    }

    if (flagValidacionesEspacio = validarEspacios(email)) {
        app.dialog.alert('El email introducido es incorrecto', 'Error');
        return null;
    }

    //Validar telefono
    var telefono = document.getElementById("telefono").value;

    if (flagValidacionTelefono = validarTelefono(telefono)) {
        app.dialog.alert('Introduzca únicamente los 9 dígitos en el teléfono', 'Error');
        return null;
    }

    //Validar ciudad
    var ciudad = document.getElementById("ciudad").value;

    if (ciudad == '0') {
        app.dialog.alert('Introduzca una ciudad', 'Error');
        return null;
    }

    //Validar descripcion
    var descripcion = document.getElementById("descripcion").value;

    if (flagValidacionesBlanco = validarCampoBlanco(descripcion)) {
        app.dialog.alert('Introduzca una descripcion', 'Error');
        return null;
    }


    var queryStringR =
        'http://' + ip + '/Adoptame/public/api/protectora/modificarProtectora';

     $.post(queryStringR, {

         idProtectora: protectora,
         nombre: nombre,
         descripcion: descripcion,
         email: email,
         telefono: telefono,
         ciudad: ciudad
     });

     alert("Se han modificado los datos de la protectora");
     window.location.replace("protIndex.html"); 
}


function validarCampoBlanco(campo) {

    if (campo == "" || campo.length == 0) {

        //alert(campo + ' el campo no puede estar vacío');
        return true;
    } else {
        //alert("Sin espacios");
        return false;
    }
}


/**
 * Funcion que comprueba si el campo contiene espacios /^\s*$/.test(campo)
 * @returns True en caso de contener espacios, sino false.
 * @param {any} campo
 */
function validarEspacios(campo) {

    //Sin espacios
    var noValido = / /;

    if (noValido.test(campo)) { // se chequea el regex de que el string no tenga espacio
        //alert("El campo no puede contener espacios en blanco");
        return true;
    } else {
        return false;
    }

}

/**
 * Funcion que comprueba que un número de teléfono está formado por nueve dígitos consecutivos
    y sin espacios ni guiones entre las cifras
 * @param {any} campo
 */
function validarTelefono(campo) {

    if (!(/^\d{9}$/.test(campo))) {
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