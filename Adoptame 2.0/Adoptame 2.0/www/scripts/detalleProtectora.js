// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.addEventListener("backbutton", onBackKeyDown, false);

//Variables
var app, ip, idAnimal, idProtectora;

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
        // ... other parameters
    });

    ip = window.sessionStorage.getItem("IP");

    //Recupera el id del animal
    idProtectora = window.sessionStorage.getItem("idDetalleProtectora");

    //Consulta datos animal
    var queryString =
        'http://' + ip + '/Adoptame/public/api/protectora/detalleProtectora/' + idProtectora;

    $.getJSON(queryString, function (results) {

        //Cargar pantalla datos animal
        document.getElementById("ciudadProtectora").innerHTML = results[0].ciudadProtectora.toUpperCase();
        document.getElementById("descripcionProtectora").innerHTML = results[0].descripcionProtectora;
        var img = results[0].fotoProtectora;
        var url = 'http://' + ip + '/Adoptame/uploads/' + img

        $('#divCard').css('background-image', 'url(' + url + ')');
        $('#divCard').html(results[0].nombreProtectora);

        $('#email').val(results[0].emailProtectora);
        $('#telefono').val(results[0].telefonoProtectora);

    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
        alert("Error en el sistema, contacte con el administrador");
    });

    var mainView = app.views.create('.view-main');
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
    Enlace para pantalla añadir animal
*/
$('#detalleProtectora').click(function () {

    window.sessionStorage.setItem("idDetalleProtectora", idProtectora);
    window.location.replace("detalleProtectora.html");
});