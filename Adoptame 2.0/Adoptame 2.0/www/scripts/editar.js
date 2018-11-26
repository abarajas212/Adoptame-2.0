// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnModificar").addEventListener('click', modificarAnimal, false);
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
var idFoto; //Nombre de la foto
var ip;
var idAnimal;
var imagen;
var flagModificarFoto;
var img; // Nombre de la imagen del animal


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
    ip = window.sessionStorage.getItem("IP");

    idAnimal = window.sessionStorage.getItem("idAnimal");

    flagModificarFoto = false;

    app.dialog.progress();

    setTimeout(function () {
        app.dialog.close();
        cargarAnimal();
    }, 2000);
};

/**
 * Funcion que carga los datos del animal para modificarlo
 */
function cargarAnimal() {

    //Recupera el id del animal
    idAnimal = window.sessionStorage.getItem("idAnimal");;

    //Consulta datos animal
    var queryString =
        'http://' + ip + '/Adoptame/public/api/animales/detalleAnimal/' + idAnimal;

        $.getJSON(queryString, function (results) {

            //Cargar pantalla datos animal

            $('#nombreAnimal').val(results[0].nombre);
            $('#descripcion').html(results[0].descripcion);
            $('#' + results[0].especie).prop("checked", true);
            $('#' + results[0].sexoAnimal).prop("checked", true);
            $('#' + results[0].tamanio).prop("checked", true);
            $('#' + results[0].estado).prop("checked", true);

            img = results[0].idFoto;
            var url = 'http://' + ip + '/Adoptame/uploads/' + img

            $('#divCard').css('background-image', 'url(' + url + ')');

            app.range.setValue('#rangoApego', results[0].apego);
            app.range.setValue('#rangoObediencia', results[0].obediencia);
            app.range.setValue('#rangoComportamiento', results[0].comportamiento);
            app.range.setValue('#rangoActividad', results[0].actividad);

            app.dialog.close();

        }).fail(function (jqXHR) {
            /* $('#error-msg').show();
             $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
            alert("Error en el sistema, contacte con el administrador");
        });
}

/**
 * Funcion que añade un animal nuevo, se activa al pulsar el boton "btnAniadir"
 */
function modificarAnimal() {

    var radios = document.getElementsByTagName('input');
    var value, tam, estado, especie, sexo;

    idAnimal = window.sessionStorage.getItem("idAnimal");
    //Validar que nombre y descripción no estén vacíos.

    nombreAnimal = document.getElementById("nombreAnimal").value;

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
                case 'tamanio':
                    tam = radios[i].value;
                    break;
                case 'especie':
                    especie = radios[i].value;
                    break;
                case 'sexoAnimal':
                    sexo = radios[i].value;
                    break;
                case 'estado':
                    estado = radios[i].value;
                    break;
            }
        }
    }

    //Recoger valor de los range
    var apego = document.getElementById("rangoApegoValue").value;
    var obediencia = document.getElementById("rangoObedienciaValue").value;
    var comportamiento = document.getElementById("rangoComportamientoValue").value;
    var actividad = document.getElementById("rangoActividadValue").value;

    var queryStringR =
        'http://' + ip + '/Adoptame/public/api/animales/modificarAnimal';

     $.post(queryStringR, {

            idAnimal: idAnimal,
            especie: especie,
            sexo: sexo,
            tamanio: tam,
            estado: estado,
            nombre: nombreAnimal,
            descripcion: descripcionAnimal,
            apego: apego,
            obediencia: obediencia,
            comportamiento: comportamiento,
            actividad: actividad
    });

     if (flagModificarFoto) {

         var options = new FileUploadOptions();
         options.fileKey = "file";
         //Se le carga el nombre de la imagen para que al subirlo se sustituya
         options.fileName = img;
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

     }

         alert("Animal modificado");
         window.location.replace("editar.html");
     
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

    flagModificarFoto = true;
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 20, allowEdit: true,
        destinationType: destinationType.FILE_URI
    });

}

function aniadirFotoGaleria() {

    flagModificarFoto = true;
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