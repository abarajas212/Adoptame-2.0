// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnEnviar").addEventListener('click', contactar, false);
/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app, ip, idAnimal, idProtectora, idUsuario, nombreAnimal;

function onDeviceReady() {
    // Controlar la pausa de Cordova y reanudar eventos
    document.addEventListener('pause', onPause.bind(this), false);
    document.addEventListener('resume', onResume.bind(this), false);

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

    //Sacar idusuario de la sesion , idAnimal, idProtectora
    idAnimal = window.sessionStorage.getItem("idAnimal");
    idProtectora = window.sessionStorage.getItem("idDetalleProtectora");
    idUsuario = window.sessionStorage.getItem("usuario");
    nombreAnimal = window.sessionStorage.getItem("nombreAnimal");

    //Cargar los datos de la protectora y del animal
    var queryString =
        'http://' + ip + '/Adoptame/public/api/cliente/' + idUsuario;

    $.getJSON(queryString, function (results) {

        $('#nombreUsuario').val(results[0].nombre);
        $('#emailUsuario').val(results[0].email);
        $('#telefonoUsuario').val(results[0].telefono);

    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
        alert("Error en el sistema, contacte con el administrador");
        });


    var queryStringP =
        'http://' + ip + '/Adoptame/public/api/protectora/' + idProtectora;

    $.getJSON(queryStringP, function (results) {

        $('#infoContacto').text("Será puesto en contacto con la protectora " + results[0].nombre + " para mostrar su interés por " + nombreAnimal);

    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
        alert("Error en el sistema, contacte con el administrador");
    });


    
    return false;

};


function contactar() {


}

/**
 * Funcion que redirecciona a la pagina de inicio
 */
function redireccionar() {
    window.location.replace("detalleAnimal.html");
};

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};



