// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnRegistro").addEventListener('click', registrarProtectora, false);
document.getElementById("btnFoto").addEventListener('click', modificarFoto, false);
document.addEventListener("backbutton", onBackKeyDown, false);
/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app, ip;
var imagen;
var protectora
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var flagModificarFoto;

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

    flagModificarFoto = false;
};


function registrarProtectora() {

    var flagValidacionesBlanco, flagValidacionesEspacio, flagValidacionTelefono;

    //Recoge id usario
    var id = document.getElementById("idUsuario").value;

    if (flagValidacionesBlanco = validarCampoBlanco(id)) {
        app.dialog.alert('Introduzca un nombre de usuario', 'Error');
        return null;
    }

    if (flagValidacionesEspacio = validarEspacios(id)) {
        app.dialog.alert('El id de usuario no puede contener espacios', 'Error');
        return null;
    }

    //Recoge password
    var password = document.getElementById("userPassword").value;

    if (flagValidacionesBlanco = validarCampoBlanco(password)) {
        app.dialog.alert('Introduzca una contraseña', 'Error');
        return null;
    }

    if (flagValidacionesEspacio = validarEspacios(password)) {
        app.dialog.alert('La contraseña no puede contener espacios', 'Error');
        return null;
    }

    //Recoge confirmacion password
    var password2 = document.getElementById("passwordConfirm").value;

    if (password != password2) {
        app.dialog.alert('Error', 'Las contraseñas no coinciden');
        return null;
    }

    //Recoge nombre 
    var nombre = document.getElementById("name").value;

    //Recoge email
    var email = document.getElementById("emailUser").value;

    if (flagValidacionesBlanco = validarCampoBlanco(email)) {
        app.dialog.alert('Introduzca un email', 'Error');
        return null;
    }

    if (flagValidacionesEspacio = validarEspacios(email)) {
        app.dialog.alert('El email introducido es incorrecto', 'Error');
        return null;
    }

    //Validar telefono
    var telefono = document.getElementById("telefono").value;

    if (flagValidacionTelefono = validarTelefono(telefono)) {
        app.dialog.alert('Introduzca únicamente los 9 dígitos en el teléfono', 'Error');
        return null;
    }

    //Validar ciudad
    var ciudad = document.getElementById("ciudad").value;

    if (ciudad == '0') {
        app.dialog.alert('Introduzca una ciudad', 'Error');
        return null;
    }


    //Comprobar que se ha cargado foto
    if (flagModificarFoto == false) {
        app.dialog.alert('Carge una foto para la protectora', 'Error');
        return null;
    }

    //Convierto el usuario a minusculas
    var idUsuario = id.toLowerCase();

    //Direccion server para utilizar json
    var queryString =
        'http://'+ip+'/Adoptame/public/api/cliente/' + id;

    var apellidos = null;

    //Comprobar que la protectora no existe en la bbdd
    $.getJSON(queryString, function (results) {

        if (jQuery.isEmptyObject(results)) {
            //Enviar json al servidor para dar de alta al usuario

            /*var queryStringR =
                'http://192.168.1.128/Adoptame/public/api/cliente/agregar';*/

            var queryStringR =
                'http://'+ip+'/Adoptame/public/api/cliente/agregar';

            //Hash de la contraseña
            var hashpassword = btoa(password);

            $.post(queryStringR, {

                idUsuario: idUsuario,
                password: hashpassword,
                nombre: nombre,
                apellidos: apellidos,
                email: email,
                telefono: telefono

            });

            var queryStringP =
                'http://'+ip+'/Adoptame/public/api/protectora/registrar';

            var descripcion = document.getElementById("descripcion").value;

            $.post(queryStringP, {

                idProtectora: id,
                nombre: nombre,
                descripcion: descripcion,
                email: email,
                telefono: telefono,
                ciudad: ciudad

            });

            
            //Enlazar usuario y protectora
            var queryStringC =
                'http://'+ip+'/Adoptame/public/api/cliente/hacerColaborador';
            
            $.post(queryStringC, {

                idProtectora: id,
                idUsuario: idUsuario

            });

            //Generar codigo protectora
            var queryStringCodigo =
                'http://'+ip+'/Adoptame/public/api/protectora/insertarCodigoProtectora';

            $.post(queryStringCodigo, {

                idProtectora: id

            });

            //Cargar el nombre de la protectora con su id
            protectora = id;
            //Subir foto
            if (flagModificarFoto) {

                var options = new FileUploadOptions();
                options.fileKey = "file";
                //options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                options.fileName = "logo" + protectora + ".jpg";
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

                //Relacionar foto con protectora

                var queryStringFoto =
                    'http://' + ip + '/Adoptame/public/api/protectora/protectoraFoto';

                $.post(queryStringFoto, {
                    idProtectora: protectora,
                    idFotoProtectora: idFoto
                });


            }

            alert('Se ha registrado correctamente');
            window.location.replace("index.html"); 

        } else {
            //Mostar popup el usuario ya existe en el sistema
            app.dialog.alert('El usuario ya está registrado, utilice otro id de usuario', 'Error');
        }

    }).fail(function (jqXHR) {
        app.dialog.alert('Error en el sistema, contacte con el administrador', 'Error');
    });


}


// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {

    $('#divCard').css('background-image', 'url(' + imageURI + ')');

    //Guardar la imagen en global
    imagen = imageURI;

    app.dialog.alert('Foto cargada');
}

function modificarFoto() {

    flagModificarFoto = true;
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: pictureSource.PHOTOLIBRARY
    });
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
 * Validaciones
 * @param {any} campo
 */
function validarCampoBlanco(campo) {

    if (campo == "" || campo.length == 0) {

        //alert(campo + ' el campo no puede estar vacío');
        return true;
    } else {
        //alert("Sin espacios");
        return false;
    }
}

/**
 * Funcion que comprueba si el campo contiene espacios /^\s*$/.test(campo)
 * @returns True en caso de contener espacios, sino false.
 * @param {any} campo
 */
function validarEspacios(campo) {

    //Sin espacios
    var noValido = / /;

    if (noValido.test(campo)) { // se chequea el regex de que el string no tenga espacio
        //alert("El campo no puede contener espacios en blanco");
        return true;
    } else {
        return false;
    }

}

/**
 * Funcion que comprueba que un número de teléfono está formado por nueve dígitos consecutivos
    y sin espacios ni guiones entre las cifras
 * @param {any} campo
 */
function validarTelefono(campo){

    if (!(/^\d{9}$/.test(campo))) {
        return true;
    } else {
        return false;
    }
}

// Funcion para mostrar y ocultar contraseñas
$("#mostrarContrasenia").change(function () {
    if ($(this).prop("checked") == true) {
        //Mostrar contrasenia
        $('#userPassword').attr('type', 'text');
        $('#passwordConfirm').attr('type', 'text');
    } else {
        //Ocultar contrasenia
        $('#userPassword').attr('type', 'password');
        $('#passwordConfirm').attr('type', 'password');
    }
});

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



