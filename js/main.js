
NUM_CAMPOS=3;
MIN_GOOD_AVERAGE = 4.3;
MIN_EXCELENT_AVERAGE = 4.5;
MAX_GRADE = 5;
STORAGE = [];
function newSubject(e){
    var autofocus = "";
    if (e.type == "click"){autofocus="autofocus";}
    e.preventDefault();
    materias = [{"nombre": "", "nota": "", "creditos": "", "autofocus":autofocus}]
    $("#tablaUsuarios tbody").append(swig.render($("#materiaTpl").html(), {locals: materias}));
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
    STORAGE = []
    var materia = [];//array para cada una de las materias
    var promedio = 0;
    var totalCreditos = 0;
    for (i=0;i<nprod;i++){
        var val = (res[i].value).replace(",",".");
        console.log(res[i].value,val);
        $("#result").append(val);
        materia.push(val); //esta linea agrega cada dato de la materia a un array
        if(cont < NUM_CAMPOS-1 ){
            cont++;
        }
        else{
            promedio += materia[1] * materia[2];
            totalCreditos += parseInt(materia[2]);
            // console.log("Total multiplicacion =" + promedio + " cred: "+ totalCreditos);
            console.log(materia)
            STORAGE.push(materia)
            materia = []; // borramos el array
            cont=0;
        }
    }
    var total = "..."
    if (! isNaN(promedio/totalCreditos)){
        total = (promedio/totalCreditos).toFixed(1);
    }
    $("#result").text(total).removeClass("white");
    saveStorage();
    return message();
}
function saveStorage () {
    if(typeof(Storage)!=="undefined"){
        localStorage.setItem('notas', JSON.stringify(STORAGE));
    }
}
function restartStorage () {
    if(typeof(Storage)!=="undefined"){
        var backup = JSON.parse(localStorage.getItem('notas'));
        if (backup != null) {
            materias = []
            console.log(backup.length)
            var i = 0;
            for (i; i<backup.length;i++){
                materias.push({"nombre": backup[i][0], "nota": backup[i][1], "creditos": backup[i][2], "autofocus": ""})
            }
            $("#tablaUsuarios tbody").append(swig.render($("#materiaTpl").html(), {locals: materias}));
            calculate(jQuery.Event("keypress"));
            if (i > 0){
                return true; // si se restauró 
            }else{
                return false; //no se restauró datos
            }
        }
    }
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
    if(!restartStorage()){
    	newSubject(jQuery.Event("keypress")); // simulamos un evento que no sea un click
    }
    $("input").addClass("form-control");
    $("#tablaUsuarios .grade:first").focus();
    $("#guardar").on("click", calculateGif);
}
function goToByScroll(element, callback){
    $('html,body').animate({
        scrollTop: $(element).offset().top - 100},
        'slow', callback);
}
$(document).on("ready", main); // cuando el document esté 'ready' ejecutar la funcion 'main'

// $(document).on("keyup", "input", calculate);
$(document).on("click", ".new-subject", newSubject);//si dan click a .newp ejecutar nuevo
$(document).on("click", ".remove-subject", removeSubject);//si dan click a .newp ejecutar nuevo

