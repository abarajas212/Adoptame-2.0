// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnRegistro").addEventListener('click', registrar, false);
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


function registrar() {

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

    //Recoge apellidos
    var apellido = document.getElementById("surnames").value;

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


    var tipo;

    //Convierto el usuario a minusculas
    id = id.toLowerCase();

    //Direccion server para utilizar json
    /*var queryString =
        'http://192.168.1.129/Adoptame/public/api/cliente/' + id;*/

    var queryString =
        'http://192.168.0.23/Adoptame/public/api/cliente/' + id;

    tipo = 3;

    //Comprobar que la protectora no existe en la bbdd
    $.getJSON(queryString, function (results) {

        if (jQuery.isEmptyObject(results)) {
            //Enviar json al servidor para dar de alta al usuario

            /*var queryStringR =
                'http://192.168.1.129/Adoptame/public/api/cliente/agregar';*/

            var queryStringR =
                'http://192.168.0.23/Adoptame/public/api/cliente/agregar';

            //Hash de la contraseña
            var hashpassword = btoa(password);

            $.post(queryStringR, {

                id: id,
                password: hashpassword,
                tipo: tipo,
                nombre: nombre,
                apellido: apellido,
                email: email

            })
                .complete(function () {
                    // Operación se completa, independientemente del estado
                })
                .success(function () {
                    // Operacion termina correctamente
                    app.dialog.alert('Se ha registrado correctamente', 'Confirmacion');
                    window.location.replace("login.html");
                })
                .error(function () {
                    // Se completa con error
                    app.dialog.alert('Error al registrar, intentelo más tarde', 'Error');
                });

        } else {
            //Mostar popup el usuario ya existe en el sistema
            app.dialog.alert('El usuario ya está registrado, utilice otro id de usuario', 'Error');
        }

    }).fail(function (jqXHR) {
        app.dialog.alert('Error en el sistema, contacte con el administrador', 'Error');
    });


}

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
//Comprobacion usuario y contraseña 
/*$('#btnRegistro').click(function () {

        var id = document.getElementById("idUsuario").value;
        var nombre = document.getElementById("name").value;
        var apellido = document.getElementById("surnames").value;
        var email = document.getElementById("email").value;
        var password = document.getElementById("userPassword").value;
        var password2 = document.getElementById("userPasswordConfirm").value;
        var tipo;

        //Comprobar parametros de entrada

        //Convierto el usuario a minusculas
        id = id.toLowerCase();

        //Direccion server para utilizar json
        var queryString =
            'http://192.168.1.129/Adoptame/public/api/cliente/' + id;

        /*Comprobar checkbox para saber que tipo de usuario es
        if (document.getElementById("check").checked == true) {
            //Protectora
            tipo = 1;
        } else {
            //Usuario
            tipo = 2;
        }*/
//Se le asigna el tipo 3 a todos los usuarios hasta que introduzcan el codigo de la protectora
/*  tipo = 3;

  //Comprobar que las contraseñas coinciden
  if (password != password2) {
      //Mostrar popup
      alert("Las contraseñas deben ser iguales");
  } else {

      //Comprobar que el usuario no existe en la bbdd
      $.getJSON(queryString, function (results) {

          if (jQuery.isEmptyObject(results)) {
              //Enviar json al servidor para dar de alta al usuario

              var queryStringR =
                  'http://192.168.1.129/Adoptame/public/api/cliente/agregar';

              //Hash de la contraseña
              var hashpassword = btoa(password);

              $.post(queryStringR, {

                  id: id,
                  password: hashpassword,
                  tipo: tipo,
                  nombre: nombre,
                  apellido: apellido,
                  email: email

              })
                  .complete(function () {
                      // Operación se completa, independientemente del estado
                  })
                  .success(function () {
                      // Operacion termina correctamente
                      alert("Se ha registrado correctamente");
                      window.location.replace("login.html");
                  })
                  .error(function () {
                      // Se completa con error
                      alert("No se pudo registrar");
                  });

          } else {
              //Mostar popup el usuario ya existe en el sistema
              alert("El usuario ya esta registrado");
          }

      }).fail(function (jqXHR) {
          /* $('#error-msg').show();
           $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
           alert("Error retrieving data. " + jqXHR.statusText)*/
/*   alert("Error en el sistema, contacte con el administrador");
});

}

});*/


function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};



