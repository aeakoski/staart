$(document).ready(function(){
    $.get("/api/painting", function(data){
        console.log(data);
        if (data.image_versions.length != 0) {
          var l = data.image_versions;
          console.log(l);
          var imageSize;

          for (var i = 0; i < l.length; i++) {
            if ("larger" === l[i]) {
              imageSize = "larger";
              break;
            }else if ("large" === l[i]) {
              imageSize = "large";
              break;
            }else if ("large_rectangle" === l[i]) {
              imageSize = "large_rectangle";
              break;
            }else if ("medium" === l[i]) {
              imageSize = "medium";
              break;
            } else if ("normalized" === l[i]) {
              imageSize = "normalized";
              break;
            } else if ("square" === l[i]) {
              imageSize = "square";
              break;
            }else if ("tall" === l[i]) {
              imageSize = "tall";
              break;
            }else if ("small" === l[i]) {
              imageSize = "small";
              break;
            }
          }

          var link = data._links.image.href.replace("{image_version}", imageSize);
          var height;
          var width;
          if (data.dimensions.cm.height && data.dimensions.cm.width) {
            height = data.dimensions.cm.height;
            width = data.dimensions.cm.width;
          }else{
            height="auto";
            width="auto";
          }

          $('.canvas').html('<img  id="canv" class="center" src="'+ link+'" height="'+ Math.log10(height)*300+'" width="auto" alt="" />');


        }else {
          $('.canvas').html('<img  id="canv" class="center" src="'+ data._links.thumbnail.href+'" height="400" width="auto" alt="" />');
        }

        $('.date').html(data.date);
        $(".title").html(data.title);
        $(".description").html(data.collecting_institution);
        $('.medium').html(data.medium);
    })

    $.get("/api/artist", function(data){
      //console.log(data);

      $('.artist').html(data.name);

      })
});
