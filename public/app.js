$(document).ready(function(){
    $.get("http://127.0.0.1:8002/api", function(data){
      console.log(data);
        $('.canvas').html('<img  src="'+ data._links.thumbnail.href+'" height="400" width="auto" alt="" />')

        $(".title").html(data.title);
        $(".description").html(data.collecting_institution);
    })
});
