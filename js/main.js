
var num_campos=3;

function newSubject(e){
	e.preventDefault();
    $("#tablaUsuarios").append("<tr>"+
        "<td><input name='materia[]' type='text' size='15' placeholder='Materia'/></td>"+
        "<td><input name='nota[]' type='text' size='10' placeholder='Nota' required autofocus /></td>"+
        "<td><input name='creditos[]' type='text' size='10' placeholder='Num. creditos' required /></td>"+
        "<td><a href='#' class='btn btn-primary btn-small new-subject' title='Agregar otra materia'>\
        <span class='glyphicon glyphicon-plus'></span></a>\
        <button type='button' class='btn btn-danger btn-small remove-subject' title='Borrar esta materia'><span class='glyphicon glyphicon-remove'></span></button></td>\
        </tr>");
    $("input").addClass("form-control");
}

//Ctrl + Shift + j     para ver la consola (consejo: usa chrome)
function calculate(e){
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
    return message();
}

function calculateGif(e){
	var v = calculate(e);
    if( v >= 4.3){
        // $("#messageGif").html("<img src='http://data3.whicdn.com/images/47754974/tumblr_mfwost4yz91s06rcqo1_500_large.gif' />");
        $("#messageGif").html("<img src='img/gif1.gif' />");
    }
}
function removeSubject(e){
    var res = $("form#f").serializeArray();
    if (res.length > num_campos){
		console.log("entra");
        $(this).closest("tr").fadeOut(400).remove();
    }
    /**
     * el boton eliminar esta jerarquicamente ubicado de la siguiente forma:
     *      form > table > tr > td > input.eliminar
     * por esta razon se debe buscar el tr para eliminarlo.
     */
}

function message(){
    $("#message, #messageGif").empty();
    var val = parseFloat($("#result").text());
    if( val >= 4){
        $("#message").text("Felicitaciones! Buen promedio");
    }
    if( val >= 4.5){
        $("#message").html("Wow!!! Qu&eacute; buen promedio! Felicitaciones!");
    }
    if( val > 5){
        $("#message").html("Creo que algo anda mal en las cuentas... o.O");
    }
    goToByScroll("#message");
    return val;
}
function main(){
	newSubject(jQuery.Event("click")); // simulamos un evento
    $("#guardar").on("click", calculateGif);
}
function goToByScroll(element, callback){
    $('html,body').animate({
        scrollTop: $(element).offset().top - 100},
        'slow', callback);
}
$(document).on("ready", main); // cuando el document esté 'ready' ejecutar la funcion 'main'

$(document).on("keyup", "input", calculate);
$(document).on("click", ".new-subject", newSubject);//si dan click a .newp ejecutar nuevo
$(document).on("click", ".remove-subject", removeSubject);//si dan click a .newp ejecutar nuevo

