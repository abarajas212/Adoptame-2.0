// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
document.addEventListener("backbutton", onBackKeyDown, false);
/**
 * Se declara app como global para poder acceder desde las diferentes funciones declaradas en javascript
 */
var app, ip, protectora;
var numCachorros, numPerros, numGatos, numRoedor, numOtros;
var numCachorrosAdoptados, numPerrosAdoptados, numGatosAdoptados, numRoedorAdoptados, numOtrosAdoptados;

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
    });

    var mainView = app.views.create('.view-main');
    ip = window.sessionStorage.getItem("IP");


    protectora = window.sessionStorage.getItem("protectora");
    //Recoger el id del animal
    var queryStringDatos =
        'http://' + ip + '/Adoptame/public/api/animales/datosProtectora/' + protectora;

    $.getJSON(queryStringDatos, function (results) {
         //Recogo los datos de los animales
        numCachorros = results[0].num;
        numPerros = results[1].num;
        numGatos = results[2].num;
        numRoedor = results[3].num;
        numOtros = results[4].num;

        if (numCachorros != 0)
            $("#animalesProtectora").append('<li><div id="especieAnimal" class="item-subtitle"><b>Cachorros: </b>' + numCachorros + '</div ></li > ');

        if (numPerros != 0)
            $("#animalesProtectora").append('<li><div id="especieAnimal" class="item-subtitle"><b>Perros: </b>' + numPerros + '</div ></li > ');

        if (numGatos != 0)
            $("#animalesProtectora").append('<li><div id="especieAnimal" class="item-subtitle"><b>Gatos: </b>' + numGatos + '</div ></li > ');

        if (numRoedor != 0)
            $("#animalesProtectora").append('<li><div id="especieAnimal" class="item-subtitle"><b>Roedores: </b>' + numRoedor + '</div ></li > ');

        if (numOtros != 0)
            $("#animalesProtectora").append('<li><div id="especieAnimal" class="item-subtitle"><b>Otros animales: </b>' + numOtros + '</div ></li > ');


        var ctx = document.getElementById("canvas").getContext("2d");

        var data = {
            labels: [
                "Cachorros",
                "Perros",
                "Gatos",
                "Roedores",
                "Otros",
            ],
            datasets: [
                {
                    data: [numCachorros, numPerros, numGatos, numRoedor, numOtros],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#ACFF33",
                        "#5E23CC"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#ACFF33",
                        "#5E23CC"
                    ]
                }]
        };

        Chart.pluginService.register({
            beforeRender: function (chart) {
                if (chart.config.options.showAllTooltips) {
                    // create an array of tooltips
                    // we can't use the chart tooltip because there is only one tooltip per chart
                    chart.pluginTooltips = [];
                    chart.config.data.datasets.forEach(function (dataset, i) {
                        chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                            chart.pluginTooltips.push(new Chart.Tooltip({
                                _chart: chart.chart,
                                _chartInstance: chart,
                                _data: chart.data,
                                _options: chart.options,
                                _active: [sector]
                            }, chart));
                        });
                    });

                    // turn off normal tooltips
                    chart.options.tooltips.enabled = false;
                }
            },
            afterDraw: function (chart, easing) {
                if (chart.config.options.showAllTooltips) {
                    // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
                    if (!chart.allTooltipsOnce) {
                        if (easing !== 1)
                            return;
                        chart.allTooltipsOnce = true;
                    }

                    // turn on tooltips
                    chart.options.tooltips.enabled = true;
                    Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                        tooltip.initialize();
                        tooltip.update();
                        // we don't actually need this since we are not animating tooltips
                        tooltip.pivot();
                        tooltip.transition(easing).draw();
                    });
                    chart.options.tooltips.enabled = false;
                }
            }
        })

        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                showAllTooltips: true
            }
        });



    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
        alert("Error en el sistema, contacte con el administrador");*/
     });


    //Recoger el id del animal
    var queryStringDatosAdoptados =
        'http://' + ip + '/Adoptame/public/api/animales/datosProtectoraAdoptados/' + protectora;

    $.getJSON(queryStringDatosAdoptados, function (results) {
        //Recogo los datos de los animales
        numCachorrosAdoptados = results[0].num;
        numPerrosAdoptados = results[1].num;
        numGatosAdoptados = results[2].num;
        numRoedorAdoptados = results[3].num;
        numOtrosAdoptados = results[4].num;

        if (numCachorrosAdoptados != 0)
            $("#animalesProtectoraAdoptados").append('<li><div id="especieAnimal" class="item-subtitle"><b>Cachorros: </b>' + numCachorrosAdoptados + '</div ></li > ');

        if (numPerrosAdoptados != 0)
            $("#animalesProtectoraAdoptados").append('<li><div id="especieAnimal" class="item-subtitle"><b>Perros: </b>' + numPerrosAdoptados + '</div ></li > ');

        if (numGatosAdoptados != 0)
            $("#animalesProtectoraAdoptados").append('<li><div id="especieAnimal" class="item-subtitle"><b>Gatos: </b>' + numGatosAdoptados + '</div ></li > ');

        if (numRoedorAdoptados != 0)
            $("#animalesProtectoraAdoptados").append('<li><div id="especieAnimal" class="item-subtitle"><b>Roedores: </b>' + numRoedorAdoptados + '</div ></li > ');

        if (numOtrosAdoptados != 0)
            $("#animalesProtectoraAdoptados").append('<li><div id="especieAnimal" class="item-subtitle"><b>Otros animales: </b>' + numOtrosAdoptados + '</div ></li > ');

        var ctx = document.getElementById("canvasAdoptados").getContext("2d");

        var data = {
            labels: [
                "Cachorros",
                "Perros",
                "Gatos",
                "Roedores",
                "Otros",
            ],
            datasets: [
                {
                    data: [numCachorrosAdoptados, numPerrosAdoptados, numGatosAdoptados, numRoedorAdoptados, numOtrosAdoptados],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#ACFF33",
                        "#5E23CC"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#ACFF33",
                        "#5E23CC"
                    ]
                }]
        };

        Chart.pluginService.register({
            beforeRender: function (chart) {
                if (chart.config.options.showAllTooltips) {
                    // create an array of tooltips
                    // we can't use the chart tooltip because there is only one tooltip per chart
                    chart.pluginTooltips = [];
                    chart.config.data.datasets.forEach(function (dataset, i) {
                        chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                            chart.pluginTooltips.push(new Chart.Tooltip({
                                _chart: chart.chart,
                                _chartInstance: chart,
                                _data: chart.data,
                                _options: chart.options,
                                _active: [sector]
                            }, chart));
                        });
                    });

                    // turn off normal tooltips
                    chart.options.tooltips.enabled = false;
                }
            },
            afterDraw: function (chart, easing) {
                if (chart.config.options.showAllTooltips) {
                    // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
                    if (!chart.allTooltipsOnce) {
                        if (easing !== 1)
                            return;
                        chart.allTooltipsOnce = true;
                    }

                    // turn on tooltips
                    chart.options.tooltips.enabled = true;
                    Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                        tooltip.initialize();
                        tooltip.update();
                        // we don't actually need this since we are not animating tooltips
                        tooltip.pivot();
                        tooltip.transition(easing).draw();
                    });
                    chart.options.tooltips.enabled = false;
                }
            }
        })

        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                showAllTooltips: true
            }
        });



    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
        alert("Error en el sistema, contacte con el administrador");*/
    });

    
   
};


/*
* Funcion que bloquea el boton atras
*/
function onBackKeyDown() {
    // Boton atras bloqueado
}

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
};

/**
 * Funcion que recupera los datos de pantalla y si son correctos realizara la recuperacion
 */
function modificar() {

    var flagValidacionesBlanco, flagValidacionesEspacio;

    //Recoge idUsuario de la sesion
    var user = window.sessionStorage.getItem("usuario");

    //Recoge password usuario
    var password = document.getElementById("password").value;

    //Recoge nueva password
    var newPassword = document.getElementById("newPassword").value;

    if (flagValidacionesBlanco = validarCampoBlanco(newPassword)) {
        app.dialog.alert('Introduzca una contraseña', 'Error');
        return null;
    }

    if (flagValidacionesEspacio = validarEspacios(newPassword)) {
        app.dialog.alert('La contraseña no puede contener espacios', 'Error');
        return null;
    }

    //Recoge confirmacion password
    var newPasswordConfirm = document.getElementById("newPasswordConfirm").value;

    if (newPassword != newPasswordConfirm) {
        app.dialog.alert('Error', 'Las contraseñas no coinciden');
        return null;
    }

    //Comprobar que la contraseña anterior es correcta
    var hash = btoa(password);

    var queryString =
        'http://' + ip + '/Adoptame/public/api/cliente/' + user;

    $.getJSON(queryString, function (results) {

        app.dialog.preloader('Modificando...');
        setTimeout(function () {
            app.dialog.close();
        }, 2000);

        //Comparo la contraseña introducida con la de la bbdd
        if (results[0].password == hash) {
            //Contraseña anterior correcta
            //Cambiar contraseña usuario 

            var newHash = btoa(newPassword);

            var queryStringR =
                'http://' + ip + '/Adoptame/public/api/cliente/modificarContrasenia'

            $.post(queryStringR, {

                idUsuario: user,
                password: newHash

            });

            alert('La contraseña ha sido modificada');
            window.localStorage.setItem("contraseniaDispositivo", newPassword);
            var pantallaAnterior = window.sessionStorage.getItem("pantallaAnterior");
            redireccionar(pantallaAnterior);

        } else {
            app.dialog.alert('La contraseña de usuario no es correcta', 'Error');
            return null;
        }

    }).fail(function (jqXHR) {
        /* $('#error-msg').show();
         $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);*/
        alert("Error, no se pudo recuperar el usuario");
    });
}

function mostrar() {

    var password = document.getElementById("password");
    var newPassword = document.getElementById("newPassword");
    var newPasswordConfirm = document.getElementById("newPasswordConfirm");

    if (password.type === "password") {
        password.type = "text";
        newPassword.type = "text";
        password.type = "text";

    } else {
        password.type = "password";
        newPassword.type = "text";
        newPasswordConfirm.type = "text";
    }
};


/**
 * Funcion que redirecciona a la pagina de inicio
 */
function redireccionar(pantalla) {
    window.location.replace(pantalla);
};

