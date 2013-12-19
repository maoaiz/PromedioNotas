
NUM_CAMPOS=3;
MIN_GOOD_AVERAGE = 4.3;
MIN_EXCELENT_AVERAGE = 4.5;
MAX_GRADE = 5;
function newSubject(e){
    var autofocus = "";
    if (e.type == "click"){autofocus="autofocus";}
    e.preventDefault();
    $("#tablaUsuarios").append("<tr>"+
        "<td><input name='materia[]' type='text' size='15' placeholder='Materia'/></td>"+
        "<td><input name='nota[]' type='number' min='0' max='5' size='10' placeholder='Nota' required " + autofocus + " class='grade' /></td>"+
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
        if(cont < NUM_CAMPOS-1 ){
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
    var total = "..."
    if (! isNaN(promedio/totalCreditos)){
        total = (promedio/totalCreditos).toFixed(1);
    }
    $("#result").text(total).removeClass("white");
    return message();
}
function calculateGif(e){
	var v = calculate(e);
    goToByScroll("#message");
    if( v >= MIN_EXCELENT_AVERAGE && v <= MAX_GRADE){
        // $("#messageGif").html("<img src='http://data3.whicdn.com/images/47754974/tumblr_mfwost4yz91s06rcqo1_500_large.gif' />");
        $("#messageGif").html("<img src='img/gif1.gif' class='img-thumbnail congratulations' />").fadeIn("slow");
        $("#result").addClass("white");
    }
}
function removeSubject(e){
    var res = $("form#f").serializeArray();
    if (res.length > NUM_CAMPOS){
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
    if( val >= MIN_GOOD_AVERAGE){
        $("#message").text("Felicitaciones! Buen promedio");
    }
    if( val >= MIN_EXCELENT_AVERAGE){
        $("#message").html("Wow!!! Qu&eacute; buen promedio! Felicitaciones!");
    }
    if( val > MAX_GRADE){
        $("#message").html("Creo que algo anda mal en las cuentas... o.O");
    }
    return val;
}
function main(){
	newSubject(jQuery.Event("keypress")); // simulamos un evento que no sea un click
    $("#tablaUsuarios .grade:first").focus();
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

