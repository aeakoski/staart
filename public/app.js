$(document).ready(function(){
    $.get("http://127.0.0.1:8002/api/painting", function(data){
      //console.log(data);
        $('.canvas').html('<img  src="'+ data._links.thumbnail.href+'" height="400" width="auto" alt="" />')
        $('.date').html(data.date);
        $(".title").html(data.title);
        $(".description").html(data.collecting_institution);
        $('.medium').html(data.medium);
    })

    $.get("http://127.0.0.1:8002/api/artist", function(data){
      //console.log(data);

      $('.artist').html(data.name);

      //TODO Hämta ut bra info ur objectet!
        })
});
