// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnRecuperar").addEventListener('click', recuperar, false);

/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app, ip;

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
    ip = window.sessionStorage.getItem("IP");

};

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};

/**
 * Funcion que recupera los datos de pantalla y si son correctos realizara la recuperacion
 */
function recuperar() {

    //Recupera los datos introducidos
    var idUsuario = document.getElementById("idUsuario").value;
    idUsuario = idUsuario.toLowerCase();

    var email = document.getElementById("email").value;

    var queryString =
        'http://' + ip + '/Adoptame/public/api/cliente/comprobarRecuperacion/' + idUsuario + '/' + email;

    $.getJSON(queryString, function (results) {

        app.dialog.preloader('Modificando...');
        setTimeout(function () {
            app.dialog.close();
        }, 2000);

        if (results[0].idUsuario != null) {
            //Usuario y email coinciden
            //Cambiar contraseña usuario autogenerada
            var password = generarPassword(20);

            //Hash de la contraseña
            var hashpassword = btoa(password);

            var queryStringR =
                'http://' + ip + '/Adoptame/public/api/cliente/modificarContrasenia'

            $.post(queryStringR, {

                idUsuario: idUsuario,
                password: hashpassword

            });

            var queryStringM =
                'http://' + ip + '/Adoptame/public/api/cliente/enviarEmail/modificarContrasenia'

            var asunto = 'Recuperar password';
            //Enviar email de cambio de contraseña
            $.post(queryStringM, {

                emailUsuario: email,
                asunto: asunto,
                idUsuario: idUsuario,
                password: password

            }, function (data) {
                // Respuesta
                app.dialog.alert(data, 'Correo enviado para recuperar contraseña', redireccionar);
                return null;
            });

        } else {
            app.dialog.alert('Los datos introducidos no son correctos', 'Error');
            return null;
        }

    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
        alert("Error, no se pudo recuperar el usuario");
    });
}

/**
 * Funcion que genera una contraseña
 * @param { any } campo
 */
function generarPassword(longitud) {

    var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ012346789";
    var password = "";
    for (i = 0; i < longitud; i++) password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    return password;
}

/**
 * Funcion que redirecciona a la pagina de inicio
 */
function redireccionar() {
    window.location.replace("index.html");
};

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