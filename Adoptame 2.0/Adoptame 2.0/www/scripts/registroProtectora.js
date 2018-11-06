// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnRegistro").addEventListener('click', registrarProtectora, false);
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
        // ... other parameters
    });

    var mainView = app.views.create('.view-main');
    ip = window.sessionStorage.getItem("IP");
};


function registrarProtectora() {

    var flagValidacionesBlanco, flagValidacionesEspacio, flagValidacionTelefono;

    //Recoge id usario
    var id = document.getElementById("idUsuario").value;

    if (flagValidacionesBlanco = validarCampoBlanco(id)) {
        app.dialog.alert('Introduzca un nombre de usuario', 'Error');
        return null;
    }

    if (flagValidacionesEspacio = validarEspacios(id)) {
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
        app.dialog.alert('La contraseña no puede contener espacios', 'Error');
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

    //Convierto el usuario a minusculas
    var idUsuario = id.toLowerCase();

    //Direccion server para utilizar json
    /*var queryString =
        'http://192.168.1.129/Adoptame/public/api/cliente/' + id;*/

    var queryString =
        'http://'+ip+'/Adoptame/public/api/cliente/' + id;

    var apellidos = null;

    //Comprobar que la protectora no existe en la bbdd
    $.getJSON(queryString, function (results) {

        if (jQuery.isEmptyObject(results)) {
            //Enviar json al servidor para dar de alta al usuario

            /*var queryStringR =
                'http://192.168.1.128/Adoptame/public/api/cliente/agregar';*/

            var queryStringR =
                'http://'+ip+'/Adoptame/public/api/cliente/agregar';

            //Hash de la contraseña
            var hashpassword = btoa(password);

            $.post(queryStringR, {

                idUsuario: idUsuario,
                password: hashpassword,
                nombre: nombre,
                apellidos: apellidos,
                email: email,
                telefono: telefono

            });/*.complete(function () {
                // Operación se completa, independientemente del estado
                alert('asdasd');
                })
                .success(function () {
                    // Operacion termina correctamente
                   /* app.dialog.alert('Se ha registrado correctamente', 'Confirmacion');
                    window.location.replace("login.html");*/
                  /*  alert('qweqwesd');
                })
                .error(function () {
                    // Se completa con error
                    app.dialog.alert('Error al registrar, intentelo más tarde', 'Error');
                    return null;
                });*/

            //Registrar protectora
            /*var queryStringP =
                'http://192.168.1.128/Adoptame/public/api/protectora/registrar';*/

            var queryStringP =
                'http://'+ip+'/Adoptame/public/api/protectora/registrar';

            var descripcion = document.getElementById("descripcion").value;

            $.post(queryStringP, {

                idProtectora: id,
                nombre: nombre,
                descripcion: descripcion,
                email: email,
                telefono: telefono,
                ciudad: ciudad

            });

            //Enlazar usuario y protectora
            /*var queryStringC =
                'http://192.168.1.128/Adoptame/public/api/cliente/hacerColaborador';*/

            var queryStringC =
                'http://'+ip+'/Adoptame/public/api/cliente/hacerColaborador';
            
            $.post(queryStringC, {

                idProtectora: id,
                idUsuario: id

            });

            //Generar codigo protectora
            /*var queryStringCodigo =
                'http://192.168.1.128/Adoptame/public/api/protectora/insertarCodigoProtectora';*/

            var queryStringCodigo =
                'http://'+ip+'/Adoptame/public/api/protectora/insertarCodigoProtectora';

            $.post(queryStringCodigo, {

                idProtectora: id

            });

            app.dialog.alert('Se ha registrado correctamente', 'Exito!');


        } else {
            //Mostar popup el usuario ya existe en el sistema
            app.dialog.alert('El usuario ya está registrado, utilice otro id de usuario', 'Error');
        }

    }).fail(function (jqXHR) {
        app.dialog.alert('Error en el sistema, contacte con el administrador', 'Error');
    });


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
function validarTelefono(campo){

    if (!(/^\d{9}$/.test(campo))) {
        return true;
    } else {
        return false;
    }
}

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};



