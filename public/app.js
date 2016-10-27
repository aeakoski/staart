$(document).ready(function(){
    $("#token").html("Yu!");

    $.get("http://127.0.0.1:8002/api", function(data){
      console.log(data);
        $('#picPlace').html('<img  src="'+ data._links.thumbnail.href+'" height="400" width="auto" alt="" />')
    })
});
