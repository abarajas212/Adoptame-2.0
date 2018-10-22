// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
var app, ip, idAnimal;

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

    //Recupera el id del animal
    idAnimal = window.sessionStorage.getItem("idAnimal");;

    //Consulta datos animal
    var queryString =
        'http://' + ip + '/Adoptame/public/api/animales/detalleAnimal/' + idAnimal;

    $.getJSON(queryString, function (results) {

        //Cargar pantalla datos animal
        document.getElementById("estadoAnimal").innerHTML = results[0].estado.toUpperCase();
        document.getElementById("descripcionAnimal").innerHTML = results[0].descripcion;
        var img = results[0].idFoto;
        var url = 'http://'+ip+'/Adoptame/uploads/' + img

        $('#divCard').css('background-image', 'url(' + url + ')');
        $('#divCard').html(results[0].nombre);

        $('#nombreProtectora').html(results[0].nombreProtectora);
        $('#ciudadProtectora').html(results[0].ciudadProtectora);
        
        $('#especieAnimal').html('Especie: '+results[0].especie);
        $('#tamanioAnimal').html('Tamaño: '+results[0].tamanio);
        $('#sexoAnimal').html('Sexo: '+results[0].sexoAnimal);

       
    }).fail(function (jqXHR) {
            /* $('#error-msg').show();
             $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
            alert("Error en el sistema, contacte con el administrador");
    });

    //Consulta para datos del animal
    //$('#divCard').css("background-image", url('http://192.168.1.128/Adoptame/uploads/1539820060731.jpg'));  
    

    //Nombre
   // $('#divCard').text("gggnat Nombre");
    /*var titulo = "gggnat Nombre";
    var text = document.createTextNode(titulo);
    divtitlecontent.appendChild(text);*/

    //Descripcion
    //document.getElementById('descripcion').innerHTML = "descripcion";

    //Estado
    $("#estado").text("estado");

};

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};


//Comprobacion usuario y contraseña 
$('#login').click(function () {

    var user = document.getElementById("txt-user").value;
    var password = document.getElementById("txt-password").value;

    //Convierto el usuario a minusculas
    user = user.toLowerCase();

    var hash = btoa(password);

    /*var queryString =
        'http://192.168.0.23/Adoptame/public/api/cliente/' + user*/

    /*  CASA  */
    var queryString =
        'http://192.168.1.128/Adoptame/public/api/cliente/' + user;

    $.getJSON(queryString, function (results) {
        //alert(results[0].nombre);

        //Si el json vuelve vacio, el usuario no existe
        if (jQuery.isEmptyObject(results)) {
            app.dialog.alert('El usuario no existe', 'Error');
            return null;
        } else { //El usuario introducido existe en el sistema
            //Comparo la contraseña introducida con la de la bbdd
            if (results[0].password != hash) {
                app.dialog.alert('Error en el usuario o contraseña', 'Error');
                return null;
            } else {
                //Compruebo que tipo de usuario es y redirijo (si pertenece a una protectora se le redirige a la pantalla de la protectora)
                if (results[0].idProtectora == null || results[0].idProtectora.isEmptyObject) {

                    //Usuario que hace login no pertenece a protectora, cargar pantalla para usuarios que buscan animales
                    //alert("Pantalla usuario");
                    //Almaceno el id de usuario en la sesion
                    window.sessionStorage.setItem("usuario", user);
                    window.location.replace("userIndex.html");

                } else {
                    //alert("Pantalla protectora");
                    //comprobar permisos que tiene el usuario y almacenarlos en las variables de la aplicacion
                    // para consultarlas cuando sea necesarioz
                    window.sessionStorage.setItem("usuario", user);
                    window.sessionStorage.setItem("protectora", results[0].idProtectora);
                    window.location.replace("protIndex.html");
                }
            }
        }

    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
        alert("Error en el sistema, contacte con el administrador");
    });
    return false;

});