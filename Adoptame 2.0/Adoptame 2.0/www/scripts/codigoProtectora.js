// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnLModificarCodigo").addEventListener('click', modificarCodigo, false);
document.addEventListener("backbutton", onBackKeyDown, false);
/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app, ip, protectora;

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

    cargarCodigo();
};

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};

/*
* Funcion que bloquea el boton atras
*/
function onBackKeyDown() {
    // Boton atras bloqueado
}
/**
 * Funcion que realiza las gestiones necesarias para unir un usuario a una protectora
 */
function cargarCodigo() {

    //Cargar la portectora de la sesion
    protectora = window.sessionStorage.getItem("protectora");
    document.getElementById("idProtectora").value = protectora;    
    
    //Consultar el codigo

    var queryString =
        'http://'+ip+'/Adoptame/public/api/protectora/obtenerCodigoProtectora/' + protectora;

    $.getJSON(queryString, function (results) {

        if (results[0].codigo != null) {
            document.getElementById("codigo").innerHTML = results[0].codigo;    
        }

    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
        alert("Error, no se puedo recuperar el codigo");
    });
}

/**
    Modificar código
*/
function modificarCodigo() {

    //Modificar codigo protectora
    var queryStringM =
        'http://' + ip + '/Adoptame/public/api/protectora/modificarCodigoProtectora';

    $.post(queryStringM, {

        idProtectora: protectora

    });

    
    app.dialog.alert('Se ha generado un nuevo código', 'Exito!');
    
    //recargar la pagina
    setTimeout(function () {
        window.location.replace("codigoProtectora.html");
    }, 3000);
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