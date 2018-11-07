// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnModificar").addEventListener('click', modificar, false);

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
function modificar() {

    var flagValidacionesBlanco, flagValidacionesEspacio;

    //Recoge idUsuario de la sesion
    var user = window.sessionStorage.getItem("usuario");

    //Recoge password usuario
    var password = document.getElementById("password").value;

    //Recoge nueva password
    var newPassword = document.getElementById("newPassword").value;

    if (flagValidacionesBlanco = validarCampoBlanco(newPassword)) {
        app.dialog.alert('Introduzca una contraseña', 'Error');
        return null;
    }

    if (flagValidacionesEspacio = validarEspacios(newPassword)) {
        app.dialog.alert('La contraseña no puede contener espacios', 'Error');
        return null;
    }

    //Recoge confirmacion password
    var newPasswordConfirm = document.getElementById("newPasswordConfirm").value;

    if (newPassword != newPasswordConfirm) {
        app.dialog.alert('Error', 'Las contraseñas no coinciden');
        return null;
    }

    //Comprobar que la contraseña anterior es correcta
    var hash = btoa(password);

    var queryString =
        'http://' + ip + '/Adoptame/public/api/cliente/' + user;

    $.getJSON(queryString, function (results) {

        app.dialog.preloader('Modificando...');
        setTimeout(function () {
            app.dialog.close();
        }, 2000);

        //Comparo la contraseña introducida con la de la bbdd
        if (results[0].password == hash) {
            //Contraseña anterior correcta
            //Cambiar contraseña usuario 

            var newHash = btoa(newPassword);

            var queryStringR =
                'http://' + ip + '/Adoptame/public/api/cliente/modificarContrasenia'

            $.post(queryStringR, {

                idUsuario: user,
                password: newHash

            });

            alert('La contraseña ha sido modificada');
            window.localStorage.setItem("contraseniaDispositivo", newPassword);
            var pantallaAnterior = window.sessionStorage.getItem("pantallaAnterior");
            redireccionar(pantallaAnterior);

        } else {
            app.dialog.alert('La contraseña de usuario no es correcta', 'Error');
            return null;
        }

    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
        alert("Error, no se pudo recuperar el usuario");
    });
}

function mostrar() {

    var password = document.getElementById("password");
    var newPassword = document.getElementById("newPassword");
    var newPasswordConfirm = document.getElementById("newPasswordConfirm");

    if (password.type === "password") {
        password.type = "text";
        newPassword.type = "text";
        password.type = "text";

    } else {
        password.type = "password";
        newPassword.type = "text";
        newPasswordConfirm.type = "text";
    }
};


/**
 * Funcion que redirecciona a la pagina de inicio
 */
function redireccionar(pantalla) {
    window.location.replace(pantalla);
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