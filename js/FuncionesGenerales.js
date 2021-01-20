const SROP = {
    Token: {
        Form: null,
        Cookie: null
    }
};

function pTokenForm(Token) {
    SROP.Token.Form = Token;
}

function pTokenCookie(Cookie) {
    SROP.Token.Cookie = Cookie;
}

$(document).ajaxStart(function () {
    $("#blurringTextG").show();

    //$(".btn-primary").button('loading');
    //$(".btn-primary").click(function () {
    //    var btn = $(this);
    //    btn.button('loading');
    //});

});



$(document).ajaxComplete(function () {
    $("#blurringTextG").hide();
    //$(".btn-primary").button('reset');
});

$.ajaxSetup({
    error: function (xhr, textStatus, errorThrown) {
        var r = undefined;
        var mensaje = "";
        if (trim(xhr.responseText) !== "") {
            r = $.parseJSON(xhr.responseText);
            mensaje = r.ExceptionMessage;
            if (mensaje === undefined) {
                mensaje = r.Data;
            }
            if (trim(mensaje) === "") {
                mensaje = r.Message;
            }
        }
        else {
            mensaje = textStatus + " - " + errorThrown;
        }

        var pMensaje = $("#pMensaje").get(0);
        if (pMensaje !== undefined) {
            $("#pMensaje").html(fMensaje(mensaje));
        }
    },
    beforeSend: function (xhr) {
        $("#pMensaje").empty();
    },
    cache: false
});


$(document).ajaxSend(function (e, request, settings) {  
    if (settings.type === "POST") {



        request.setRequestHeader('RequestVerificationToken', SROP.Token.Cookie + ':' + SROP.Token.Form);
    }
});


function DameEntero(numero) {

    if (numero === undefined) { return 0; }
    if (numero === null) { return 0; }
    numero = parseInt(numero, 10);
    if (isNaN(numero)) { return 0; }
    return parseInt(numero, 10);

}

function DameDecimal(numero, FL_ORIGINAL) {

    if (numero === undefined) { return 0; }
    if (numero === null) { return 0; }
    numero = parseFloat(numero, 10);
    if (isNaN(numero)) { return 0; }
    if (FL_ORIGINAL === true) { return parseFloat(numero, 10); } else { return parseFloat(numero, 10).toFixed(2); }


}


function trim(cadena) {
    if (cadena === undefined) { return ''; }
    if (cadena === null) { return ''; }
    for (i = 0; i < cadena.length;) {
        if (cadena.charAt(i) === " ")
            cadena = cadena.substring(i + 1, cadena.length);
        else
            break;
    }

    for (i = cadena.length - 1; i >= 0; i = cadena.length - 1) {
        if (cadena.charAt(i) === " ")
            cadena = cadena.substring(0, i);
        else
            break;
    }
    return cadena;
}






function fMensaje(MENSAJE) {
    var TXMENSAJES = "";
    var MENSAJE_COL = isJSON(MENSAJE);
    if (MENSAJE_COL === null) { return TXMENSAJES; }

    var pMensaje = $("#pMensaje").get(0);

    $.each(MENSAJE_COL, function (i, item) {
        if (DameEntero(item.IDTIPOMENSAJE) === 1) {//EXITO = 1
            TXMENSAJES = TXMENSAJES + "<div style='display:none;' class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" + trim(item.TXMENSAJE) + "</div>";
        } else if (DameEntero(item.IDTIPOMENSAJE) === 2) {//INFORMACION = 2
            TXMENSAJES = TXMENSAJES + "<div class='alert alert-info alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" + trim(item.TXMENSAJE) + "</div>";
        } else if (DameEntero(item.IDTIPOMENSAJE) === 3) {//ADVERTENCIA = 3
            TXMENSAJES = TXMENSAJES + "<div class='alert alert-warning alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" + trim(item.TXMENSAJE) + "</div>";
        } else if (DameEntero(item.IDTIPOMENSAJE) === 4 || DameEntero(item.IDTIPOMENSAJE) === 0) {//PELIGRO = 4
            TXMENSAJES = TXMENSAJES + "<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" + trim(item.TXMENSAJE) + "</div>";
        }
    });

    if (pMensaje !== undefined) {
        $("#pMensaje").html(TXMENSAJES);
        setTimeout(function () {
            $(".alert").fadeOut(3000);
        }, 3000);
    }
    return TXMENSAJES;
}


function isJSON(TXJSON) {
    var MEN = null;
    try {
        if (typeof (TXJSON) === "string") {
            MEN = JSON.parse(TXJSON);
        } else {
            MEN = TXJSON;
        }
    }
    catch (e) {
        if (typeof (TXJSON) === 'string') {
            if (TXJSON.length === 0) {
                return null;
            }
            else {
                MEN = {};
                MEN.IDTIPOMENSAJE = 4;
                MEN.TXMENSAJE = TXJSON;
            }
        }
        else {
            return null;
        }
    }

    if (Object.prototype.toString.call(MEN) === '[object Array]') {
        return MEN;
    }
    else {
        var MEN_COL = [];
        MEN_COL.push(MEN);
        return MEN_COL;
    }

    //return MEN_COL;
}






//function printElement(elem, append, delimiter) {
//    var domClone = elem.cloneNode(true);

//    var $printSection = document.getElementById("printSection");

//    if (!$printSection) {
//        var $printSection = document.createElement("div");
//        $printSection.id = "printSection";
//        document.body.appendChild($printSection);
//    }

//    if (append !== true) {
//        $printSection.innerHTML = "";
//    }

//    else if (append === true) {
//        if (typeof (delimiter) === "string") {
//            $printSection.innerHTML += delimiter;
//        }
//        else if (typeof (delimiter) === "object") {
//            $printSection.appendChlid(delimiter);
//        }
//    }

//    $printSection.appendChild(domClone);
//}

//flOpcion = 1: Paginacion, 2: Ordenar
$.fn.tablaFuncional = function (parametros) {
    var configuracion = {
        pagina: 1
    };
    $.extend(configuracion, parametros);
    configuracion.tabla = $(this).attr('id');
    $(this).find('.ordenatablafuncional').click(configuracion, onClickOrdenaTablaFuncional);
    $('.pagination').find('.pagtablafuncional').click(configuracion, onClickPaginaTablaFuncional);

    //if (configuracion.tabla == undefined || configuracion.tabla == null) {
    //    window[configuracion.funcion]('NUPAGINAACTUAL=' + configuracion.pagina);
    //} 

}

function fPaginaActual() {
    var NUPAGINAACTUAL = 1;
    var paginaactiva = $("#paginaactiva").get(0);
    if (paginaactiva !== undefined) {
        NUPAGINAACTUAL = DameEntero($(paginaactiva).data("paginaactiva"));
    }
    return NUPAGINAACTUAL;
}


function onClickOrdenaTablaFuncional(prm) {
    var pr = prm.data;
    var txtpagina = '&NUPAGINAACTUAL=' + fPaginaActual();
    var ordena = [];
    var itemOrdenaSeleccionado = eval('(' + $(this).data('ordenatabla') + ')');
    var priority = 1;
    $('#' + pr.tabla + ' .ordenatablafuncional').each(function () {
        var itemOrdena = eval('(' + $(this).data('ordenatabla') + ')');
        //Actualizar el orden seleccionado
        if (itemOrdenaSeleccionado.property === itemOrdena.property) {
            if (itemOrdena.direction === 'ASC') { itemOrdena.direction = 'DESC'; } else { itemOrdena.direction = 'ASC'; }
            itemOrdena.priority = 0;
        } else {
            itemOrdena.priority = priority;
            priority = priority + 1;
        }
        ordena.push(itemOrdena);
    });

    var criterioOrden = '';
    if (ordena.length > 0) {
        criterioOrden = 'sort=' + JSON.stringify(ordena);
    }

    window[pr.funcion](criterioOrden + txtpagina);
}

function onClickPaginaTablaFuncional(prm) {
    var pr = prm.data;
    var ordena = [];
    var itemPaginaSeleccionado = eval('(' + $(this).data('paginatabla') + ')');
    var txtpagina = '&NUPAGINAACTUAL=' + itemPaginaSeleccionado.pagina;
    $('#' + pr.tabla + ' .ordenatablafuncional').each(function () {
        var itemOrdena = eval('(' + $(this).data('ordenatabla') + ')');
        ordena.push(itemOrdena);
    });

    var criterioOrden = '';
    if (ordena.length > 0) {
        criterioOrden = 'sort=' + JSON.stringify(ordena);
    }

    window[pr.funcion](criterioOrden + txtpagina);
}

//function TablaJACH(objTh,flOpcion, nombreFuncion, nombreTabla, NUPAGINAACTUAL) {
//    var txtordena = null;
//    var txtpagina = '&NUPAGINAACTUAL=' + fPaginaActual();
//    var ordena = [];
//    var itemOrdenaSeleccionado = null;
//    if (flOpcion == 2) {
//        itemOrdenaSeleccionado = eval('(' + $(objTh).data('ordenatabla') + ')');
//    } else {
//        txtpagina = '&NUPAGINAACTUAL=' + NUPAGINAACTUAL;
//    }
//    var priority = 1;
//    $('#' + nombreTabla + ' .ordenatablafuncional').each(function () {
//        var itemOrdena = eval('(' + $(this).data('ordenatabla') + ')');
//        //Actualizar el orden seleccionado
//        if (flOpcion == 2) {
//            if (itemOrdenaSeleccionado.property == itemOrdena.property) {
//                if (itemOrdena.direction == 'ASC') {
//                    itemOrdena.direction = 'DESC';
//                } else {
//                    itemOrdena.direction = 'ASC';
//                }
//                itemOrdena.priority = 0;
//            } else {
//                itemOrdena.priority = priority;
//                priority = priority + 1;
//            }
//        }

//        ordena.push(itemOrdena);
//    });

//    var criterioOrden = '';
//    if (ordena.length > 0) {
//        criterioOrden = 'sort=' + JSON.stringify(ordena);
//    }

//    window[nombreFuncion](criterioOrden + "&" + txtpagina);
//}