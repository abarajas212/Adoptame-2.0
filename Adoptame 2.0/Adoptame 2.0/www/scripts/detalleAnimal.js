// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnContactar").addEventListener('click', contactar, false);
document.getElementById("mostrarFoto").addEventListener('click', mostrarFoto, false);
document.addEventListener("backbutton", onBackKeyDown, false);

var app, ip, idAnimal, idProtectora, nombreAnimal;
var apego, obediencia, comportamiento, actividad;
var urlImagen;
var myPhotoBrowserStandalone;

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

    //Inicialización para capturar elementos de DOM7
    $$ = Dom7;

    ip = window.sessionStorage.getItem("IP");

    //Recupera el id del animal
    idAnimal = window.sessionStorage.getItem("idAnimal");
    
    //Consulta datos animal
    var queryString =
        'http://' + ip + '/Adoptame/public/api/animales/detalleAnimal/' + idAnimal;

    $.getJSON(queryString, function (results) {

        //Cargar pantalla datos animal
        document.getElementById("estadoAnimal").innerHTML = results[0].estado.toUpperCase();
        document.getElementById("descripcionAnimal").innerHTML = results[0].descripcion;
        var img = results[0].idFoto;
        urlImagen = 'http://'+ip+'/Adoptame/uploads/' + img

        $('#divCard').css('background-image', 'url(' + urlImagen + ')');
        $('#divCard').html(results[0].nombre);
        nombreAnimal = results[0].nombre;

        $('#nombreProtectora').html(results[0].nombreProtectora);
        $('#ciudadProtectora').html(results[0].ciudadProtectora);
        
        $('#especieAnimal').html('Especie: '+results[0].especie);
        $('#tamanioAnimal').html('Tamaño: '+results[0].tamanio);
        $('#sexoAnimal').html('Sexo: '+results[0].sexoAnimal);

        idProtectora = results[0].idProtectora;

        app.range.setValue('#rangoApego', results[0].apego);
        app.range.setValue('#rangoObediencia', results[0].obediencia);
        app.range.setValue('#rangoComportamiento', results[0].comportamiento);
        app.range.setValue('#rangoActividad', results[0].actividad);

        /*=== Crea galeria ===*/
        myPhotoBrowserStandalone = app.photoBrowser.create({
            photos: [
                urlImagen
            ]
        });
       
    }).fail(function (jqXHR) {
            /* $('#error-msg').show();
             $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
            //alert("Error en el sistema, contacte con el administrador");
    });

    var mainView = app.views.create('.view-main');
 
};

/**
 * Funcion para desactivar el boton atras
 */
function onBackKeyDown() {
    // Desactiva el boton atras
}

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};

function contactar() {

    window.sessionStorage.setItem("idDetalleProtectora", idProtectora);
    window.sessionStorage.setItem("nombreAnimal", nombreAnimal);
    window.location.replace("contactar.html");

}


//Open photo browser on click
function mostrarFoto() {
    myPhotoBrowserStandalone.open();
}

/**
    Enlace para pantalla añadir animal
*/
$('#detalleProtectora').click(function () {

    window.sessionStorage.setItem("idDetalleProtectora", idProtectora);
    window.location.replace("detalleProtectora.html");
});