// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnAniadir").addEventListener('click', aniadirAnimal, false);
document.getElementById("btnFoto").addEventListener('click', aniadirFoto, false);
document.getElementById("btnFotoGaleria").addEventListener('click', aniadirFotoGaleria, false);

/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app;

var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var nombreAnimal; // Nombre del animal que se recoge por pantalla
var idProtectora; //Id de la protectora que se recogera de la variable que se carga al hacer login
var fecha; //Fecha de recogida del animal
var idFoto; //Nombre de la foto
var ip;
var imagen;


function onDeviceReady() {
    // Controlar la pausa de Cordova y reanudar eventos
    document.addEventListener('pause', onPause.bind(this), false);
    document.addEventListener('resume', onResume.bind(this), false);

    // Carga los controladores de la camara
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;

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
    //Inicializacion
    ip = window.sessionStorage.getItem("IP");
    imagen = null;

    var calendarDefault = app.calendar.create({
        inputEl: '#calendar-default',
    });
};


/**
 * Funcion que añade un animal nuevo, se activa al pulsar el boton "btnAniadir"
 */
function aniadirAnimal() {

    var radios = document.getElementsByTagName('input');
    var value, tam, estado, especie, sexo;

    //Validar que nombre y descripción no estén vacíos.

    nombreAnimal = document.getElementById("nombre").value;

    if (validarCampoBlanco(nombreAnimal)) {
        app.dialog.alert('Introduzca un nombre para el animal', 'Error');
        return 1;
    }

    var descripcionAnimal = document.getElementById("descripcion").value;

    if (validarCampoBlanco(descripcionAnimal)) {
        app.dialog.alert('Introduzca una descripcionAnimal para el animal', 'Error');
        return 1;
    }

    //Recorre todos los inputs de la pantalla
    for (var i = 0; i < radios.length; i++) {
        //Si son radios y estan checked se revisa de que tipo son
        if (radios[i].type === 'radio' && radios[i].checked) {
            // Se guardan los valores seleccionados
            switch (radios[i].name) {
                case 'tam':
                    tam = radios[i].value;
                    break;
                case 'especie':
                    especie = radios[i].value;
                    break;
                case 'sexo':
                    sexo = radios[i].value;
                    break;
                case 'estado':
                    estado = radios[i].value;
                    break;
            }
        }
    }

    // Enviar los datos a la bbdd
    idProtectora = window.sessionStorage.getItem("protectora");

    var apego = document.getElementById("rangoApego").value;
    var obediencia = document.getElementById("rangoObediencia").value;
    var comportamiento = document.getElementById("rangoComportamiento").value;
    var actividad = document.getElementById("rangoActividad").value;
    fecha = document.getElementById("calendar-default").value;

    //Comprobar si hay foto cargada
    if (imagen == null) {
        app.dialog.close();
        app.dialog.alert('Es obligatorio cargar una imagen', 'Error');
        return null;
    }

    //Url donde hacer el post para agregar el animal
    var queryStringR =
        'http://'+ ip +'/Adoptame/public/api/protectora/agregar';

    $.post(queryStringR, {

        idProtectora: idProtectora,
        especie: especie,
        sexo: sexo,
        tamanio: tam,
        estado: estado,
        nombre: nombreAnimal,
        descripcion: descripcionAnimal,
        apego: apego,
        obediencia: obediencia,
        comportamiento: comportamiento,
        actividad: actividad,
        fecha_ingreso: fecha

    }, function (data) {
        //alert(data);
    });

    var numero = Math.floor(Math.random() * (999 + 1)); 
    //Subir la foto
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = idProtectora + nombreAnimal + numero.toString() + ".jpg";
    options.mimeType = "image/jpeg";

    var params = {};
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;
    //Guardar el nombre de la foto
    idFoto = options.fileName;
    //Transferir
    var ft = new FileTransfer();

    //Subir la foto
    ft.upload(imagen, encodeURI("http://" + ip + "/Adoptame/public/api/protectora/uploadFoto"), win, fail, options);

    //Relaccionar la foto con el animal
    //Recoger el id del animal
    var queryStringFoto =
        'http://' + ip + '/Adoptame/public/api/protectora/obtenerIdAnimal/' + idProtectora + '/' + nombreAnimal;

    //Cierro los dialogos antes de mostrar uno nuevo
    app.dialog.close();
    app.dialog.preloader('Guardando...');

    setTimeout(function () {

        $.getJSON(queryStringFoto, function (results) {

            if (results.length == 0) {
                app.dialog.close();
                app.dialog.alert('Se ha producido un error al publicar el animal', 'Error', redireccionar);
            } else {
                //Recogo el id del animal
                var idAnimal = results[0].idAnimal

                //Enviar una peticion post para almacenar los datos que relacionan el animal con la foto
                var queryStringSubirFoto =
                    'http://' + ip + '/Adoptame/public/api/protectora/animalFoto';

                $.post(queryStringSubirFoto, {

                    idAnimal: idAnimal,
                    idFoto: idFoto

                }, function (data) {
                    // Respuesta
                    app.dialog.close();
                    app.dialog.alert('Se ha añadido el animal correctamente', 'Registrado', redireccionar);
                });
            }

        }).fail(function (jqXHR) {
            /* $('#error-msg').show();
             $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
            alert("Error en el sistema, contacte con el administrador");*/
         });
    }, 2000);
}

/*
*  Funciones para el manejo de la imagen
*/

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {

    $('#divCard').css('background-image', 'url(' + imageData + ')');

    //Guardar la imagen en global
    imagen = imageData;

    app.dialog.alert('Foto cargada');
    
}
// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {

    $('#divCard').css('background-image', 'url(' + imageURI + ')');

    //Guardar la imagen en global
    imagen = imageURI;

    app.dialog.alert('Foto cargada');
}

// Limpiar cache
function clearCache() {
    navigator.camera.cleanup();
}


//Log del envio
function fail(error) {
    alert("An error has occurred: Code = " + error.code);
    alert("upload error source " + error.source);
    alert("upload error target " + error.target);
}

// Called if something bad happens.
//
function onFail(message) {
    //alert('Failed because: ' + message);
    alert('Error: La foto ha sido cancelada');
}

//Log del envio
function win(r) {

    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}


/**
 * Funcion que abre la camara para hacer una foto y añadirla
 */
function aniadirFoto() {

    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 20, allowEdit: true,
        destinationType: destinationType.FILE_URI
    });

}

function aniadirFotoGaleria() {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: pictureSource.PHOTOLIBRARY
    });
}

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
/**
 * Funcion que redirecciona a la pagina de inicio
 */
function redireccionar() {
    window.location.replace("protIndex.html");
};

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};