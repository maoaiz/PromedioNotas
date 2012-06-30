var num_campos=4;//numero de campos input por fila;  esta variable debería actializarse dinamicamente, debería leer el número de inputs, esta te la dejo de tarea

function nuevo(){
    //alert("nuevo")
    $("#tablaUsuarios").append("<tr>"+
        "<td><input name='prod[]' type='text' size='15' placeholder='Ingresa Marca' required/></td>"+
        "<td><input name='cant[]' type='text' size='10' placeholder='Ingresa Cantidad' required/></td>"+
        "<td><input name='desc[]' type='text' size='10' placeholder='Ingresa Descripcion' required/></td>"+
        "<td><input name='val[]' type='text' size='10' placeholder='Ingresa Valor' required/></td>"+
        "<td><input type='button' value='Eliminar' onclick='eliminar(this)' class='btn btn-danger eliminar'></td>"+
        "</tr>")
}

//Ctrl + Shift + j     para ver la consola (consejo: usa chrome)
function guardar(e){
    //NOTA: Recuerda SIMPRE VALIDAR los campos del formulario del lado del servidor y el cliente.
    e.preventDefault()
    var res = $("form#f").serializeArray();
    //console.log(res)//descomenta esta linea y mira la consola, así llegan nuestros datos,
    var nprod = res.length;
    var cont = 0;
    $("#result").empty();//limpiar la caja
    var productos = [];//un array que contendra a los arrays (filas o productos)
    var producto = [];//array para cada una de las filas 
    for (i=0;i<nprod;i++){//debe imprimer de 4 en 4 porque estan todos los inputs en un solo array
  
        $("#result").append(res[i].value);
        
        //VALIDAR SIEMPRE
        producto.push(res[i].value);//esta linea agrega los datos a nuestro array
        
        if(cont < num_campos-1 ){
            $("#result").append(", ");
            cont++;
        }
        else{
            $("#result").append(" <br />");
            productos.push(producto);
            producto = [];
            cont=0;
        }
    }
    console.log(productos);//productos es un array que contiene n arrays (n productos)
    
}

function eliminar(e){
    $(e).parent().parent().fadeOut(400).remove();
/**
     * el boton eliminar esta jerarquicamente asi:
     *      form > table > tr > td > input.eliminar
     * por esta razon se debe subir dos posiciones 
     */
}

function iniciar(){
    //alert("Hola Jquery")
    $("#newp").on("click",nuevo)//si dan click a #newp ejecutar nuevo
    $("#guardar").on("click",guardar)
}

$(document).on("ready",iniciar)//cuando el document esté 'ready' ejecutar la funcion 'iniciar'