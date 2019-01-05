// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnEnviar").addEventListener('click', contactar, false);
/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app, ip, idAnimal, idProtectora, idUsuario, nombreAnimal, nombreUsuario, emailUsuario, telefonoUsuario, emailProtectora;

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
        emailUsuario = results[0].email;
        $('#emailUsuario').val(results[0].email);
        telefonoUsuario = results[0].telefono;
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
        emailProtectora = results[0].email;

    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
        alert("Error en el sistema, contacte con el administrador");
    });


    
    return false;

};


function contactar() {

    //Comprobar email y teléfono
    var flagValidacionesBlanco, flagValidacionesEspacio;
    var radios = document.getElementsByTagName('input');

    //Recoge email
    var emailUsuario = document.getElementById("emailUsuario").value;

    if (flagValidacionesBlanco = validarCampoBlanco(emailUsuario)) {
        app.dialog.alert('Introduzca un email', 'Error');
        return null;
    }

    if (flagValidacionesEspacio = validarEspacios(emailUsuario)) {
        app.dialog.alert('El email introducido es incorrecto', 'Error');
        return null;
    }

    //Recoge teléfono
    telefonoUsuario = document.getElementById("telefonoUsuario").value;

    if (flagValidacionesBlanco = validarCampoBlanco(telefonoUsuario)) {
        app.dialog.alert('Introduzca un teléfono', 'Error');
        return null;
    }

    if (flagValidacionesEspacio = validarEspacios(telefonoUsuario)) {
        app.dialog.alert('El teléfono introducido es incorrecto', 'Error');
        return null;
    }

    //Recoge nombre
    var nombreUsuario = document.getElementById("nombreUsuario").value;

    if (flagValidacionesBlanco = validarCampoBlanco(nombreUsuario)) {
        app.dialog.alert('Introduzca un nombre para contactar con usted', 'Error');
        return null;
    }


    //Mensaje
    var mensaje = document.getElementById("mensaje").value;

    if (flagValidacionesBlanco = validarCampoBlanco(mensaje)) {
        app.dialog.alert('Introduzca un nombre mensaje', 'Error');
        return null;
    }

    //Que desea
    //Recorre todos los inputs de la pantalla
    for (var i = 0; i < radios.length; i++) {
        //Si son radios y estan checked se revisa de que tipo son
        if (radios[i].type === 'radio' && radios[i].checked) {
            // Se guardan el valor seleccionado
            var desea = radios[i].value;
        }
    }

    //Post email

    var asunto = desea + " " + nombreAnimal;

    var queryStringM =
        'http://' + ip + '/Adoptame/public/api/protectora/enviarEmail/contactoProtectora';

    $.post(queryStringM, {

        emailProtectora: emailProtectora,
        emailUsuario: emailUsuario,
        nombreUsuario: nombreUsuario,
        asunto: asunto,
        telefonoUsuario: telefonoUsuario,
        mensaje: mensaje

    }, function (data) {
        // Respuesta
        app.dialog.alert(data, 'Envio', redireccionar);
        return null;
    });



}

/**
 * Funcion que redirecciona a la pagina de inicio
 */
function redireccionar() {
    window.location.replace("detalleAnimal.html");
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

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};



