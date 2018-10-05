// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnAniadir").addEventListener('click', aniadirAnimal, false);
document.getElementById("btnFoto").addEventListener('click', aniadirFoto, false);
/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app;

var pictureSource;   // picture source
var destinationType; // sets the format of returned value


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
};


/**
 * Funcion que añade un animal nuevo, se activa al pulsar el boton "btnAniadir"
 */
function aniadirAnimal() {

    var radios = document.getElementsByTagName('input');
    var value, tam, estado, especie, sexo;

    //Validar que nombre y descripción no estén vacíos.

    var nombreAnimal = document.getElementById("nombre").value;

    if (validarCampoBlanco(nombreAnimal)) {
        app.dialog.alert('Introduzca un nombre para el animal', 'Error');
        return null;
    }

    var descripcionAnimal = document.getElementById("descripcion").value;

    if (validarCampoBlanco(descripcionAnimal)) {
        app.dialog.alert('Introduzca una descripcionAnimal para el animal', 'Error');
        return null;
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
    var idProtectora = window.sessionStorage.getItem("protectora");

    var ciudad = null;
    //Url donde hacer el post
    var queryStringR =
        'http://192.168.1.131/Adoptame/public/api/protectora/agregar';


    $.post(queryStringR, {

        idProtectora: idProtectora,
        ciudad: ciudad,
        especie: especie,
        sexo: sexo,
        tamanio: tam,
        estado: estado,
        nombre: nombreAnimal,
        descripcion: descripcionAnimal

    });

    alert("Guardado correctamente");
    window.location.replace("protIndex.html");
    

}

/*
*  Funciones para el manejo de la imagen
*/

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    // Uncomment to view the base64-encoded image data
    // console.log(imageData);

    // Get image handle
    //
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    //
    smallImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    //smallImage.src = "data:image/jpeg;base64," + imageData;

    smallImage.src = imageData;

    //Una vez puesta la foto en html la subimos al servidor

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageData.substr(imageData.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";

    var params = {};
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;

    var ft = new FileTransfer();
    //ft.upload(imageData, encodeURI("http://192.168.0.174/APIrestAdoptame/gabri.php"), win, fail, options);
    ft.upload(imageData, encodeURI("http://192.168.1.131/Adoptame/public/api/protectora/uploadFoto"), win, fail, options);

}

// Limpiar cache
function clearCache() {
    navigator.camera.cleanup();
}

//Enviar la foto al servidor
var retries = 0;
function EnviarServidor(image) {

    var win = function (r) {
        clearCache();
        retries = 0;
        alert('Done!');
    }

    var fail = function (error) {
        if (retries == 0) {
            retries++
            setTimeout(function () {
                onCapturePhoto(fileURI)
            }, 1000)
        } else {
            retries = 0;
            clearCache();
            alert('Ups. Something wrong happens!');
        }
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {}; // if we need to send parameters to the server request
    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI("http://192.168.1.131/Adoptame/public/api/protectora/uploadFoto"), win, fail, options);
}

//Log del envio
function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
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
    alert('Failed because: ' + message);
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