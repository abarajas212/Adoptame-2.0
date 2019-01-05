// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);

/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app, ip, idAnimal, idProtectora, accion;

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

    protectora = window.sessionStorage.getItem("protectora");
    ip = window.sessionStorage.getItem("IP");

    accion = window.sessionStorage.getItem("accion");

    if (accion == "editar") {
        $("#titulo").html("Editar");
    } else if (accion == "verAdoptados"){
        $("#titulo").html("Adoptados");
    }
    

    cargarAnimales();

};

/**
 * Funcion que rellena la pantalla principal de usuario con animales
 */
function cargarAnimales() {
    //Variables html
    var lu; var li; var a; var innerDiv; var img; var divinner; var divtitle;
    var divtitlecontent; var text; var divsubtitle; var textsubtitle; var ruta;
    var divtext; var textt; var queryString;

    var i;
    //Peticion de animales al servidor

    if (accion == "editar") {
        queryString =
            'http://' + ip + '/Adoptame/public/api/animales/menuProtectora/' + protectora;
    } else if (accion == "verAdoptados") {
        queryString =
            'http://' + ip + '/Adoptame/public/api/animales/menuProtectora/adoptados/' + protectora;
    }

    //Comprobar que el usuario no existe en la bbdd
    $.getJSON(queryString, function (results) {
        if (results.length == 0) {
            document.getElementById('divListaAnimales').innerHTML = '<div class="block block-strong text-align-center"><div class="block-title" > No se han encontrado animales</div >';
        } else {
            for (i = 0; i < results.length; i++) {

                //Recoger lu y meter li dentro
                lu = document.getElementById("listaAnimales");
                li = document.createElement("li");
                li.id = results[i].idAnimal;
                lu.appendChild(li);

                //Titulo
                a = document.createElement("a");
                a.href = '#';
                a.id = results[i].idAnimal;
                a.setAttribute('class', 'item-link item-content');
                li.appendChild(a);

                innerDiv = document.createElement('div');
                innerDiv.setAttribute('class', 'item-media');
                a.appendChild(innerDiv);

                //Imagen
                img = document.createElement("IMG");
                //ruta = "http://192.168.1.128/Adoptame/uploads/" + results[i].idFoto;
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

            }
        }

    }).fail(function (jqXHR) {
        //app.dialog.alert('Error en el sistema, contacte con el administrador', 'Error');
    });

}

/*
* Evento que recoge la pulsación sobre la referencia del animal
*/
$("#listaAnimales").on("click", "a", function () {

    var idAnimal = $(this).attr('id');
    //Guardar el id del animal para cargar la pagina personal del animal
    window.sessionStorage.setItem("idAnimal", idAnimal);

    if (accion == "editar") {
        window.location.replace("editar.html");
    } else if (accion == "verAdoptados"){
        window.location.replace("detalleAdoptado.html");
    }
    
})


/**
 * Funcion que redirecciona a la pagina de inicio
 */
function filtrar() {
    window.location.replace("filtrar.html");
}


/**
 * Funcion que redirecciona a la pagina de inicio
 */
function redireccionar() {
    window.location.replace("index.html");
};

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};