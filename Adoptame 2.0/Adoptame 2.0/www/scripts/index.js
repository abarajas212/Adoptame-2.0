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

        //alert(user + "  Contraseña: " + password);
        
        var contrahash = atob(hash);
        alert(contrahash);

        var queryString =
            'http://192.168.1.129/Adoptame/public/api/cliente/' + user;

        $.getJSON(queryString, function (results) {
            //alert(results[0].nombre);

            //Si el json vuelve vacio, el usuario no existe
            if (jQuery.isEmptyObject(results)) {
                alert("Usuario incorrecto");
            } else { //El usuario introducido existe en el sistema
                //Comparo la contraseña introducida con la de la bbdd
                if (results[0].password != password) {
                    alert("Error en el usuario o contraseña");
                } else {
                    //Compruebo que tipo de usuario es y redirijo

                    if (results[0].tipo == 1) {
                        alert("Protectora");
                        //Almaceno en sesion el usuario
                        window.sessionStorage.setItem("usuario", user);
                        //window.location.replace("protIndex.html");
                    } else if (results[0].tipo == 2) {
                        alert("Usuario");
                        window.sessionStorage.setItem("usuario", user);
                        // var user = window.sessionStorage.getItem("usuario");
                       // window.location.replace("userIndex.html");
                    } else {
                        alert("Error al iniciar sesion");
                    }
                }
            }

        }).fail(function (jqXHR) {
            /* $('#error-msg').show();
             $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
            alert("Error en el sistema, contacte con el administrador");
        });
        return false;

    });

$('#registro').click(function () {
    window.location.replace("registro.html");
    });

$('#pruebas').click(function () {
    window.location.replace("pruebas.html");
});