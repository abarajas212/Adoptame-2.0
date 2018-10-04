// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnAniadir").addEventListener('click', aniadirAnimal, false);
/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app;

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

    //todo Enviar los datos a la bbdd
    //var idUsuario = window.sessionStorage.getItem("usuario");

    //Actualmente la ciudad se recoge por pantalla (modificar para que al iniciar sesion con protectora)
    // Se cargue automáticamente la ciudad


    //Url donde hacer el post
    var queryStringR =
        'http://192.168.1.131/Adoptame/public/api/protectora/agregar';

    $.post(queryStringR, {

        idUsuario: idUsuario,
        especie: especie,
        sexo: sexo,
        ciudad: ciudad,
        tamanio: tam,
        estado: estado,
        nombre: nombre,
        descripcion: descripcion

    }) .complete(function () {
            // Operación se completa, independientemente del estado
            app.dialog.alert('Se ha añadido correctamente', 'Añadido', redireccionar);
        })
        .success(function () {
            // Operacion termina correctamente
            app.dialog.alert('Se ha añadido correctamente', 'Añadido', redireccionar);
        })
        .error(function () {
            // Se completa con error
            app.dialog.alert('Error al añadir, intentelo más tarde', 'Error', redireccionar);
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