// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnRegistro").addEventListener('click', registrar, false);
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
        // ... other parameters
    });

    var mainView = app.views.create('.view-main');
};


function registrar() {

    var flagValidacionesBlanco, flagValidacionesEspacio;

    //Recoge id usario
    var idUsuario = document.getElementById("idUsuario").value;

    if (flagValidacionesBlanco = validarCampoBlanco(idUsuario)) {
        app.dialog.alert('Introduzca un nombre de usuario', 'Error');
        return null;
    }

    if (flagValidacionesEspacio = validarEspacios(idUsuario)) {
        app.dialog.alert('El id de usuario no puede contener espacios', 'Error');
        return null;
    }

    //Recoge password
    var password = document.getElementById("userPassword").value;

    if (flagValidacionesBlanco = validarCampoBlanco(password)) {
        app.dialog.alert('Introduzca una contraseña', 'Error');
        return null;
    }

    if (flagValidacionesEspacio = validarEspacios(password)) {
        app.dialog.alert('La contraseña no puede contener espacios','Error');
        return null;
    }

    //Recoge confirmacion password
    var password2 = document.getElementById("passwordConfirm").value;

    if (password != password2) {
        app.dialog.alert('Error', 'Las contraseñas no coinciden');
        return null;
    }

    //Recoge nombre 
    var nombre = document.getElementById("name").value;

    //Recoge apellidos
    var apellido = document.getElementById("surnames").value;

    //Recoge email
    var email = document.getElementById("emailUser").value;

    if (flagValidacionesBlanco = validarCampoBlanco(email)) {
        app.dialog.alert('Introduzca un email', 'Error');
        return null;
    }

    if (flagValidacionesEspacio = validarEspacios(email)) {
        app.dialog.alert('El email introducido es incorrecto', 'Error');
        return null;
    }

    //Convierto el usuario a minusculas
    idUsuario = idUsuario.toLowerCase();

    //Direccion server para utilizar json
   /* var queryString =
        'http://192.168.1.131/Adoptame/public/api/cliente/' + idUsuario;*/

    var queryString =
        'http://192.168.1.128/Adoptame/public/api/cliente/' + idUsuario;

    //Comprobar que el usuario no existe en la bbdd
    $.getJSON(queryString, function (results) {

        if (jQuery.isEmptyObject(results)) {
            //Enviar json al servidor para dar de alta al usuario

            /*var queryStringR =
                'http://192.168.1.131/Adoptame/public/api/cliente/agregar';*/

            var queryStringR =
                'http://192.168.1.128/Adoptame/public/api/cliente/agregar';

            //Hash de la contraseña
            var hashpassword = btoa(password);

            $.post(queryStringR, {

                idUsuario: idUsuario,
                password: hashpassword,
                nombre: nombre,
                apellidos: apellido,
                email: email

            })
                .complete(function () {
                    // Operación se completa, independientemente del estado
                    app.dialog.alert('Se ha registrado correctamente', 'Registrado', redireccionar);
                })
                .success(function () {
                    // Operacion termina correctamente
                    app.dialog.alert('Se ha registrado correctamente', 'Registrado', redireccionar);
                })
                .error(function () {
                    // Se completa con error
                    app.dialog.alert('Error al registrar, intentelo más tarde', 'Error', redireccionar);
                });

        } else {
            //Mostar popup el usuario ya existe en el sistema
            app.dialog.alert('El usuario ya está registrado, utilice otro id de usuario', 'Error', redireccionar);
        }

    }).fail(function (jqXHR) {
        //app.dialog.alert('Contacte con el administrador', 'Error');
    });

    //Comprobar si el usuario ha pulsado colabora con una protectora
    var toggle = app.toggle.get('.toggle');

    if (toggle.checked) {
        window.sessionStorage.setItem("usuarioColabora", idUsuario);
        app.dialog.alert('Se ha registrado correctamente, sera redirigido para unirse a una protectora', 'Colaborador', redireccionarAvanzado);
    } else {
        app.dialog.alert('Se ha registrado correctamente', 'Registrado', redireccionar);
    }

 
}

/**
 * Funcion que comprueba si el campo esta en blanco
 * @param {any} campo
 */
 function validarCampoBlanco(campo){

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

/**
 * Funcion que redirecciona a la pagina de inicio
 */
function redireccionar() {
    window.location.replace("index.html");
};

/**
 * Funcion que redirecciona a la pagina para introducir el codigo de colaboración
 */
function redireccionarAvanzado() {
    window.location.replace("registroAvanzado.html");
};

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};



