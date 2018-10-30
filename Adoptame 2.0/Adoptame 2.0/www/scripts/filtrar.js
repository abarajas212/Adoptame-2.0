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

//Variables para cargar y guardar filtros

var especie, sexo, tamanio, estado;

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

    var str = window.sessionStorage.getItem("fitradoBusqueda");

    if (str != null) {

        var cadena = str.split('/'),
            especie = cadena[0]; sexo = cadena[1]; tamanio = cadena[2]; estado = cadena[3];

            $('#especie').val(especie);

            //Recoger lu y meter li dentro
            var titulo = document.getElementById("tituloEspecie");
            var subtitulo = document.createElement("div");
            subtitulo.setAttribute('class', 'item-after');
            subtitulo.innerHTML = "Hello"
            titulo.appendChild(subtitulo);

            $('#sexo').val(sexo);
            $('#tamanio').val(tamanio);
            $('#estado').val(estado);
    }


};

/**
 * Funcion que recoge el valor de los filtros que se han seleccionado
 */
function filtrar() {

    var especie = $("#especie").val();
    var sexo = $("#sexo").val();
    var tamanio = $("#tamanio").val();
    var estado = $("#estado").val();

    var filtrado = especie + "/" + sexo + "/" + tamanio + "/" + estado;

    alert(filtrado);
    window.sessionStorage.setItem("fitradoBusqueda", filtrado);

    // Volver a la pantalla de seleccion una vez almacenados los datos
    //window.location.replace("userIndex.html");
}

/*
   
*/
function limpiarFiltros() {
    window.sessionStorage.removeItem("fitradoBusqueda");
    window.location.replace("filtrar.html"); 
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