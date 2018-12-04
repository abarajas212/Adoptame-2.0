// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnPassword").addEventListener('click', cambiarPassword, false);
document.getElementById("btnSesion").addEventListener('click', cerrarSesion, false);

/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app, user, protectora, ip;

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

    //Cargar el usuario y la portectora de la sesion
    user = window.sessionStorage.getItem("usuario");
    document.getElementById("usuarioP").innerHTML = "<b>Usuario:</b> " + user;

    protectora = window.sessionStorage.getItem("protectora");
    document.getElementById("protectoraP").innerHTML = "<b>Protectora:</b> " + protectora;

    ip = window.sessionStorage.getItem("IP");
};

/**
    Enlace para pantalla añadir animal
*/
$('#aniadir').click(function () {
    window.location.replace("add.html");
});


/**
    Enlace para pantalla añadir animal
*/
$('#editar').click(function () {
    window.sessionStorage.setItem("accion", "editar");
    window.location.replace("animalesProtectora.html");
});

/**
    Enlace para ver codigo protectora
*/
$('#eliminar').click(function () {
    window.location.replace("eliminar.html");
});


/**
    Marcar como adoptado
*/
$('#adoptado').click(function () {
    window.location.replace("marcarAdoptado.html");
});

/**
    Enlace para ver codigo protectora
*/
$('#verCodigo').click(function () {
    window.location.replace("codigoProtectora.html");
});

/**
    Enlace para modificar datos de la protectora
*/
$('#modificarProtectora').click(function () {
    window.location.replace("editarProtectora.html");
});

/**
    Enlace para ver adoptados
*/
$('#verAdoptados').click(function () {
    window.sessionStorage.setItem("accion", "verAdoptados");
    window.location.replace("animalesProtectora.html");
});

/**
    Enlace para ver datos de la protectora
*/
$('#verDatosProtectora').click(function () {
    window.location.replace("datosProtectora.html");
});

// Prompt para enviar codigo por email
$('#enviarCodigo').click(function () {
    app.dialog.prompt('Escriba el email del destinatario del código', function (email) {
        app.dialog.confirm('¿Está seguro de que desea enviar el código a: ' + email + '?', function () {
            //Consultar codigo de la protectora
            //Cargar la portectora de la sesion
            protectora = window.sessionStorage.getItem("protectora");

            var destinatario = email.toLowerCase();

            if (destinatario != null){
                //Consultar el codigo
                /*  CASA  
                var queryString =
                    'http://192.168.1.128/Adoptame/public/api/protectora/obtenerDatoEmail/' + protectora;*/

                var queryString =
                    'http://' + ip + '/Adoptame/public/api/protectora/obtenerDatoEmail/' + protectora;


                $.getJSON(queryString, function (results) {

                    //Recoge los datos
                    if (results[0].codigo != null) {
                        var codigo = results[0].codigo;
                    }

                    if (results[0].idProtectora != null) {
                        var idProtectora = results[0].idProtectora;
                    }

                    if (results[0].nombre != null) {
                        var nombreProtectora = results[0].nombre;
                    }

                    //Post para enviar el email
                    /*var queryStringP =
                        'http://192.168.1.128/Adoptame/public/api/protectora/enviarEmail/codigoProtectora';*/

                    var queryStringP =
                        'http://' + ip + '/Adoptame/public/api/protectora/enviarEmail/codigoProtectora';

                    $.post(queryStringP, {

                        idProtectora: idProtectora,
                        codigo: codigo,
                        nombreProtectora: nombreProtectora,
                        destinatario: destinatario

                    })
                        .complete(function () {
                            // Operación se completa, independientemente del estado
                            //app.dialog.alert('Se ha enviado el email correctamente', 'Enviado', redireccionar);
                        })
                        .success(function () {
                            // Operacion termina correctamente
                            //app.dialog.alert('Se ha registrado correctamente', 'Registrado', redireccionar);
                        })
                        .error(function () {
                            // Se completa con error
                            //app.dialog.alert('Error al registrar, intentelo más tarde', 'Error', redireccionar);
                        });


                        app.dialog.alert('Ok, se enviará un email a ' + email + ' con el código para que pueda unirse a la protectora');

                    }).fail(function (jqXHR) {
                    /* $('#error-msg').show();
                     $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
                    alert("Error, no se puedo recuperar el codigo");
                    });
            }
        });
    });
});

/**
 * Funcion que redirige para cambiar la contraseña
 */
function cambiarPassword() {
    //Redirecciona para modificar password
    window.sessionStorage.setItem("pantallaAnterior", "protIndex.html");
    window.location.replace("modificarPassword.html");
}

/**
 * Funcion que cierra sesion, redirigiendo y eliminando los datos de sesion
 */
function cerrarSesion() {
    //Mostrar popup de confirmacion
    app.dialog.confirm('¿Está seguro de que desea cerrar sesión?', function () {
        app.dialog.alert('Hasta pronto! :)');
        window.sessionStorage.clear();
        window.localStorage.clear();
        window.location.replace("index.html");
        user = null;
        protectora = null;
    });

}


/**
 * Funcion que redirecciona a la pagina de inicio
 */
function redireccionar() {
    window.location.replace("index.html");
};

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};