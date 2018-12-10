// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.getElementById("btnMarcar").addEventListener('click', marcar, false);
document.getElementById("btnSesion").addEventListener('click', cerrarSesion, false);

/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app, ip;
var user;

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

    //Cargar el usuario y la portectora de la sesion
    user = window.sessionStorage.getItem("usuario");
    //document.getElementById("usuarioP").innerHTML = "Usuario: " + user;

    protectora = window.sessionStorage.getItem("protectora");
    //document.getElementById("protectoraP").innerHTML = "Protectora: " + protectora;

    ip = window.sessionStorage.getItem("IP");

    cargarAnimales();

};

/**
 * Funcion que rellena la pantalla principal de usuario con animales
 */
function cargarAnimales() {
    //Variables html
    var lu; var li; var a; var innerDiv; var img; var divinner; var divtitle;
    var divtitlecontent; var text; var divsubtitle; var textsubtitle; var ruta;
    var divtext; var textt;

    var i;
    //Peticion de animales al servidor
    var queryString =
        'http://' + ip + '/Adoptame/public/api/animales/menuProtectora/' + protectora;

    //Comprobar que el usuario no existe en la bbdd
    $.getJSON(queryString, function (results) {

        for (i = 0; i < results.length; i++) {

            //Recoger lu y meter li dentro
            lu = document.getElementById("listaAnimales");
            li = document.createElement("li");
            li.id = results[i].idAnimal;
            lu.appendChild(li);

            //Titulo
            a = document.createElement("div");
            a.id = results[i].idAnimal;
            a.setAttribute('class', 'item-content');

            li.appendChild(a);

            innerDiv = document.createElement('div');
            innerDiv.setAttribute('class', 'item-media');
            a.appendChild(innerDiv);

            //Imagen
            img = document.createElement("IMG");
            //ruta
            ruta = "http://" + ip + "/Adoptame/uploads/" + results[i].idFoto;
            img.setAttribute("src", ruta);
            img.setAttribute("width", "80");
            innerDiv.appendChild(img);

            divinner = document.createElement('div');
            divinner.setAttribute('class', 'item-inner');
            a.appendChild(divinner);

            divtitle = document.createElement('div');
            divtitle.setAttribute('class', 'item-title-row');
            divinner.appendChild(divtitle);

            //Subtitulo
            divtitlecontent = document.createElement('div');
            divtitlecontent.setAttribute('class', 'item-title');
            var titulo = results[i].nombre;
            text = document.createTextNode(titulo);
            divtitlecontent.appendChild(text);
            divtitle.appendChild(divtitlecontent);

            divsubtitle = document.createElement('div');
            divsubtitle.setAttribute('class', 'item-subtitle');
            var titulodown = results[i].estado;
            textsubtitle = document.createTextNode(titulodown);
            divsubtitle.appendChild(textsubtitle);
            divinner.appendChild(divsubtitle);

            //Texto
            divtext = document.createElement('div');
            divtext.setAttribute('class', 'item-text');
            textt = document.createTextNode(results[i].descripcion);
            divtext.appendChild(textt);
            divinner.appendChild(divtext);

            var chekbox = document.createElement("input");
            chekbox.id = results[i].idAnimal;
            chekbox.setAttribute('type', 'checkbox');
            chekbox.setAttribute('value', results[i].idAnimal);
            a.appendChild(chekbox);

        }


    }).fail(function (jqXHR) {
        //app.dialog.alert('Error en el sistema, contacte con el administrador', 'Error');
    });

}


/**
 * Funcion que redirecciona a la pagina de inicio
 */
function marcar() {

    app.dialog.confirm('¿Está seguro de que desea marcar como adoptado?', function () {

        var seleccionados = new Array();
        var archivos = new Array();
        var radios = document.getElementsByTagName('input');

        //Recorre todos los inputs de la pantalla
        for (var i = 0; i < radios.length; i++) {
            //Si son radios y estan checked se revisa de que tipo son
            if (radios[i].type === 'checkbox' && radios[i].checked) {
                // Se guardan los valores seleccionados
                seleccionados.push(radios[i].id);
            }
        }

        var queryString =
            'http://' + ip + '/Adoptame/public/api/animales/marcarAdoptados';

        $.post(queryString, {

            idAnimal: seleccionados

        }, function (data) {
            // Respuesta
            app.dialog.alert('Se ha marcado correctamente', 'Marcados', redireccionar);
        });

    });
}

/**
 * Funcion que cierra sesion, redirigiendo y eliminando los datos de sesion
 */
function cerrarSesion() {
    //Mostrar popup de confirmacion
    app.dialog.confirm('¿Está seguro de que desea cerrar sesión?', function () {
        app.dialog.alert('Hasta pronto! :)');
        window.sessionStorage.clear();
        window.localStorage.clear();
        window.location.replace("index.html");
    });

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