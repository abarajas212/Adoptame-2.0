// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    var app;
    var ip;
    var contraseniaDispositivo;
    var usuarioDispositivo;

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

        window.sessionStorage.setItem("IP", "192.168.1.128");
        ip = "192.168.1.128";

        //Comprobar si hay usuario guardado y su contrasenia
        usuarioDispositivo = window.localStorage.getItem("usuarioDispositivo");
        contraseniaDispositivo = window.localStorage.getItem("contraseniaDispositivo");

        //Si tienen usuario guardado se comprueba y se direcciona sin necesidad de hacer login
        if (usuarioDispositivo != null && contraseniaDispositivo != null) {

            var hash = btoa(contraseniaDispositivo);

            var queryStringR =
                'http://' + ip + '/Adoptame/public/api/cliente/' + usuarioDispositivo;

            $.getJSON(queryStringR, function (results) {

                //Si el json vuelve vacio, el usuario no existe
                if (jQuery.isEmptyObject(results)) {
                    return null;
                } else { //El usuario introducido existe en el sistema
                    //Comparo la contraseña introducida con la de la bbdd
                    if (results[0].password != hash) {
                        return null;
                    } else {

                        //Compruebo que tipo de usuario es y redirijo (si pertenece a una protectora se le redirige a la pantalla de la protectora)
                        if (results[0].idProtectora == null || results[0].idProtectora.isEmptyObject) {

                            //Usuario que hace login no pertenece a protectora, cargar pantalla para usuarios que buscan animales
                            //Almaceno el id de usuario en la sesion
                            window.sessionStorage.setItem("usuario", usuarioDispositivo);
                            window.location.replace("userIndex.html");

                        } else {
                            //alert("Pantalla protectora");
                            //comprobar permisos que tiene el usuario y almacenarlos en las variables de la aplicacion
                            // para consultarlas cuando sea necesarioz
                            window.sessionStorage.setItem("usuario", usuarioDispositivo);
                            window.sessionStorage.setItem("protectora", results[0].idProtectora);
                            window.location.replace("protIndex.html");
                        }
                    }
                }

            }).fail(function (jqXHR) {
                /* $('#error-msg').show();
                 $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
                alert("Error, no se puedo conectar con el servidor");
            });

            return false;
        }

        var mainView = app.views.create('.view-main');
    };

    function onPause() {
        // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
    };

    function onResume() {
        // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
    };

    //Comprobacion usuario y contraseña 
    $('#login').click(function () {

        var user = document.getElementById("txt-user").value;
        var password = document.getElementById("txt-password").value;

        //Convierto el usuario a minusculas
        user = user.toLowerCase();
        
        var hash = btoa(password);

        var queryString =
            'http://'+ ip +'/Adoptame/public/api/cliente/' + user;

        $.getJSON(queryString, function (results) {

            //Si el json vuelve vacio, el usuario no existe
            if (jQuery.isEmptyObject(results)) {
                app.dialog.alert('El usuario no existe', 'Error');
                return null;
            } else { //El usuario introducido existe en el sistema
                //Comparo la contraseña introducida con la de la bbdd
                if (results[0].password != hash) {
                    app.dialog.alert('Error en el usuario o contraseña', 'Error');
                    return null;
                } else {

                     //Guardar sesion
                     window.localStorage.setItem("usuarioDispositivo", user);
                     window.localStorage.setItem("contraseniaDispositivo", password);
                    
                    //Compruebo que tipo de usuario es y redirijo (si pertenece a una protectora se le redirige a la pantalla de la protectora)
                    if (results[0].idProtectora == null || results[0].idProtectora.isEmptyObject){

                        //Usuario que hace login no pertenece a protectora, cargar pantalla para usuarios que buscan animales
                        //alert("Pantalla usuario");
                        //Almaceno el id de usuario en la sesion
                        window.sessionStorage.setItem("usuario", user);
                        window.location.replace("userIndex.html");

                    } else {
                        //alert("Pantalla protectora");
                        // Almacena usuario y protectora

                        window.sessionStorage.setItem("usuario", user);
                        window.sessionStorage.setItem("protectora", results[0].idProtectora);
                        window.location.replace("protIndex.html");
                    }
                }
            }

        }).fail(function (jqXHR) {
            /* $('#error-msg').show();
             $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
            alert("Error, no se puedo conectar con el servidor");
        });
        return false;

    });

/*
    Enlace a la pantalla de registro
*/
$('#registro').click(function () {
    window.location.replace("registro.html");
    });

/*
    Enlace a la pantalla de registro de protectora
*/
$('#registarProtectora').click(function () {
    window.location.replace("registroProtectora.html");
});

/*
    Enlace a la pantalla de recuperar contraseña
*/
$('#recuperarContrasenia').click(function () {
    window.location.replace("recuperarContrasenia.html");
});