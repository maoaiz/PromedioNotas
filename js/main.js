
NUM_CAMPOS=3;
MIN_GOOD_AVERAGE = 4.3;
MIN_EXCELENT_AVERAGE = 4.5;
MAX_GRADE = 5;

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
    var STORAGE = []
    var materia = [];//array para cada una de las materias
    var promedio = 0;
    var totalCreditos = 0;
    var calc_str = "";
    for (i=0;i<nprod;i++){
        var val = (res[i].value).replace(",",".");
        $("#result").append(val);
        materia.push(val); //esta linea agrega cada dato de la materia a un array
        if(cont < NUM_CAMPOS-1 ){
            cont++;
        }
        else{
            promedio += materia[1] * materia[2];
            calc_str += materia[1] + " * " + materia[2] + " = " + (materia[1] * materia[2]) + " +<br>";
            totalCreditos += parseInt(materia[2]);
            // console.log("Total multiplicacion =" + promedio + " cred: "+ totalCreditos);
            STORAGE.push(materia)
            materia = []; // borramos el array
            cont=0;
        }
    }
    var total = "..."
    if (! isNaN(promedio/totalCreditos)){
        total = (promedio/totalCreditos).toFixed(1);
        calc_str += "_______________<br>total = " + promedio+"<br>tot. creditos = " + totalCreditos + "<br><br>" + promedio +"/"+totalCreditos + " = " + (promedio/totalCreditos);
    }
    $("#result").text(total).removeClass("white");
    saveStorage(STORAGE);
    return message(calc_str);
}
function saveStorage (STORAGE) {
    if(typeof(Storage)!=="undefined"){
        localStorage.setItem('notas', JSON.stringify(STORAGE));
    }
}
function loadStorage () {
    if(typeof(Storage)!=="undefined"){
        var backup = JSON.parse(localStorage.getItem('notas'));
        if (backup != null) {
            materias = []
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
function message(calc){
    $("#showCalc div").html(calc)
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
function validateInput (e) {
    var value = $(this).val();
    console.log(e.keyCode, value);
    $(this).val(value.replace(/\,/i, '.'));

    if (!(/^[0-9.,]*$/.test(value))){
        e.preventDefault();
        $(this).val(value.slice(0,-1));
    }
    if (e.keyCode === 13){
        calculateGif(e);
    }
}
function showCalc(e) {
    e.preventDefault();
    $("#showCalc div").slideToggle();
}
function main(){
    if(!loadStorage()){
    	newSubject(jQuery.Event("keypress")); // simulamos un evento que no sea un click
    }
    $("input").addClass("form-control");
    $("#tablaUsuarios .grade:first").focus();
    $("#guardar").on("click", calculateGif);
    $("#showCalc a").on("click", showCalc);
}
function goToByScroll(element, callback){
    $('html,body').animate({
        scrollTop: $(element).offset().top - 100},
        'slow', callback);
}
$(document).ready(main); // cuando el document esté 'ready' ejecutar la funcion 'main'

$(document).on("keyup", 'input.input-number', validateInput);
$(document).on("click", ".new-subject", newSubject);//si dan click a .newp ejecutar nuevo
$(document).on("click", ".remove-subject", removeSubject);//si dan click a .newp ejecutar nuevo

