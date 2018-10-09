// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnSesion").addEventListener('click', cerrarSesion, false);

/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app, user, protectora;

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
    document.getElementById("usuarioP").innerHTML = "Usuario: " + user;

    protectora = window.sessionStorage.getItem("protectora");
    document.getElementById("protectoraP").innerHTML = "Protectora: " + protectora;
};

/**
    Enlace para pantalla añadir animal
*/

$('#aniadir').click(function () {
    window.location.replace("add.html");
});
/**
 * Funcion que redirecciona a la pagina de inicio
 */
function filtrar() {
    window.location.replace("filtrar.html");
}

/**
 * Funcion que cierra sesion, redirigiendo y eliminando los datos de sesion
 */
function cerrarSesion() {
    //Mostrar popup de confirmacion
    app.dialog.confirm('¿Está seguro de que desea cerrar sesión?', function () {
        app.dialog.alert('Hasta pronto! :)');
        window.sessionStorage.clear();
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