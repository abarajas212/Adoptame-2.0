// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);

function onDeviceReady() {
    // Controlar la pausa de Cordova y reanudar eventos
    document.addEventListener('pause', onPause.bind(this), false);
    document.addEventListener('resume', onResume.bind(this), false);

    // TODO: Cordova se ha cargado. Haga aquí las inicializaciones de Cordova y Framework 7.
    var app = new Framework7({
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

//Comprobacion usuario y contraseña 
$('#registro').click(function () {

    if (validateForm()) {

        var id = document.getElementById("txt-id").value;
        var nombre = document.getElementById("txt-name").value;
        var apellido = document.getElementById("txt-last-name").value;
        var email = document.getElementById("txt-email").value;
        var password = document.getElementById("txt-password").value;
        var password2 = document.getElementById("txt-password-confirm").value;
        var tipo;

        //Comprobar parametros de entrada

        //Convierto el usuario a minusculas
        id = id.toLowerCase();

        //Direccion server para utilizar json
        var queryString =
            'http://192.168.1.129/APIrestAdoptame/public/api/cliente/' + id;

        /*Comprobar checkbox para saber que tipo de usuario es
        if (document.getElementById("check").checked == true) {
            //Protectora
            tipo = 1;
        } else {
            //Usuario
            tipo = 2;
        }*/
        //Se le asigna el tipo 3 a todos los usuarios hasta que introduzcan el codigo de la protectora
        tipo = 3;

        //Comprobar que las contraseñas coinciden
        if (password != password2) {
            //Mostrar popup
            alert("Las contraseñas deben ser iguales");
        } else {

            //Comprobar que el usuario no existe en la bbdd
            $.getJSON(queryString, function (results) {

                if (jQuery.isEmptyObject(results)) {
                    //Enviar json al servidor para dar de alta al usuario

                    var queryStringR =
                        'http://192.168.1.129/Adoptame/public/api/cliente/agregar';

                    //Hash de la contraseña
                    var hashpassword = btoa(password);

                    $.post(queryStringR, {

                        id: id,
                        password: hashpassword,
                        tipo: tipo,
                        nombre: nombre,
                        apellido: apellido,
                        email: email

                    })
                        .complete(function () {
                            // Operación se completa, independientemente del estado
                        })
                        .success(function () {
                            // Operacion termina correctamente
                            alert("Se ha registrado correctamente");
                            window.location.replace("login.html");
                        })
                        .error(function () {
                            // Se completa con error
                            alert("No se pudo registrar");
                        });

                } else {
                    //Mostar popup el usuario ya existe en el sistema
                    alert("El usuario ya esta registrado");
                }

            }).fail(function (jqXHR) {
                /* $('#error-msg').show();
                 $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
                 alert("Error retrieving data. " + jqXHR.statusText)*/
                alert("Error en el sistema, contacte con el administrador");
            });


        }

    } else {

        //alert("Introduce los parametros obligatorios");
    }

});


function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};



