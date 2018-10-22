// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnFiltrar").addEventListener('click', filtrar, false);
document.getElementById("btnLimpiar").addEventListener('click', limpiarFiltros, false);
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

/**
 * Funcion que recoge el valor de los filtros que se han seleccionado
 */
function filtrar() {

    var especie = $("#especie").val();
    alert(especie);

    var sexo = $("#sexo").val();
    var sexo = $("#tamanio").val();
    var estado = $("#estado").val();


    // Volver a la pantalla de seleccion una vez almacenados los datos
    //window.location.replace("userIndex.html");
}

/*
   
*/
function limpiarFiltros() {

    window.location.replace("filtrar.html");
    
    var especie = $("#especie").val();
    var sexo = $("#sexo").val();
    var sexo = $("#tamanio").val();
    var estado = $("#estado").val();

    alert(especie);

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