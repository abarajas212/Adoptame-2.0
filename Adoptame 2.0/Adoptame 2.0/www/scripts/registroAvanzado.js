// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnUnirse").addEventListener('click', unirse, false);

/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app;

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
        // Habilita la funcion pegar en inputs
        touch: {
            disableContextMenu: false,
        }
    });

    var mainView = app.views.create('.view-main');
};

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};

/**
 * Funcion que realiza las gestiones necesarias para unir un usuario a una protectora
 */
function unirse() {

    var codigo = document.getElementById("codigo").value;
    var idProtectora = document.getElementById("idProtectora").value;

    if (flagValidacionesBlanco = validarCampoBlanco(idProtectora)) {
        app.dialog.alert('Introduzca un identificador de protectora', 'Error');
        return null;
    }

    if (flagValidacionesBlanco = validarCampoBlanco(codigo)) {
        app.dialog.alert('Introduzca un codigo', 'Error');
        return null;
    }

    //Comprobar

    /*  CASA  */
    var queryString =
        'http://192.168.1.128/Adoptame/public/api/cliente/comprobarCodigo/' + idProtectora+ '/'+ codigo;

    $.getJSON(queryString, function (results) {

        //Compara el codigo recibido con el que ha introducido el usuario
        if (jQuery.isEmptyObject(results)) {
            app.dialog.alert('Los datos introducidos son incorrectos', 'Error');
            return null;
        } else {
            //Se recibe respuesta del servidor, el id de la protectora es correcto, hay que comprobar el codigo

            var idUsuario = window.sessionStorage.getItem("usuarioColabora");

            var queryStringR =
                'http://192.168.1.128/Adoptame/public/api/cliente/hacerColaborador';

            $.post(queryStringR, {

                idProtectora: idProtectora,
                idUsuario: idUsuario

            });

            //Eliminar usuario window.sessionStorage.setItem("usuarioColabora", idUsuario);
            app.dialog.alert('Se ha registrado en la protectora correctamente','Exito!');
            window.sessionStorage.clear();
            window.location.replace("index.html");

        }


    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
        alert("Error en el sistema, contacte con el administrador");
        return false;
    });
    
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