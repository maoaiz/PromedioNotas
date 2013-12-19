// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
var num_campos=3;

function nuevo(){
    $("#tablaUsuarios").append("<tr>"+
        "<td><input name='materia[]' type='text' size='15' placeholder='Materia'/></td>"+
        "<td><input name='nota[]' type='text' size='10' placeholder='Nota' required/></td>"+
        "<td><input name='creditos[]' type='text' size='10' placeholder='Num. creditos' required/></td>"+
        "<td><a href='#' onclick='nuevo()' class='btn btn-primary btn-small' title='Agregar otra materia'><i class='icon-plus icon-white'></i></a> <button type='button' onclick='eliminar(this)' class='btn btn-danger btn-small eliminar' title='Borrar esta materia'><i class='icon-remove icon-white'></i></button></td>"+
        "</tr>");
}

//Ctrl + Shift + j     para ver la consola (consejo: usa chrome)
function calcular(e){
    //NOTA: Recuerda SIMPRE VALIDAR los campos del formulario del lado del servidor y el cliente.
    e.preventDefault();
    var res = $("form#f").serializeArray();
    //console.log(res);//descomenta esta linea y mira la consola, así llegan nuestros datos,
    var nprod = res.length;
    var cont = 0;
    $("#result").empty();//limpiar la caja de notas
    var materia = [];//array para cada una de las materias
    var promedio = 0;
    var totalCreditos = 0;
    for (i=0;i<nprod;i++){
        $("#result").append(res[i].value);
        materia.push(res[i].value); //esta linea agrega cada dato de la materia a un array
        if(cont < num_campos-1 ){
            cont++;
        }
        else{
            promedio += materia[1] * materia[2];
            totalCreditos += parseInt(materia[2]);
            console.log("Total multiplicacion =" + promedio + " cred: "+ totalCreditos);
            materia = []; // borramos el array
            cont=0;
        }
    }
    $("#result").text((promedio/totalCreditos).toFixed(1));
    message();
}

function eliminar(e){
    var res = $("form#f").serializeArray();
    if (res.length > num_campos){
        $(e).closest("tr").fadeOut(400).remove();
    }
    /**
     * el boton eliminar esta jerarquicamente ubicado asi:
     *      form > table > tr > td > input.eliminar
     * por esta razon se debe buscar el tr para eliminarlo.
     */
}

function message(){
    $("#message").empty();
    var val = parseInt($("#result").text());
    if( val >= 4){
        $("#message").text("Felicitaciones! Buen promedio");
    }
}

function iniciar(){
    nuevo();
    $(".newp").on("click", nuevo);//si dan click a .newp ejecutar nuevo
    $("#guardar").on("click", calcular);
    $("input").on("keyup", calcular);
}

$(document).on("ready", iniciar); // cuando el document esté 'ready' ejecutar la funcion 'iniciar'
