

$(document).ready(function(){
    $("#token").html("Yu!");

    var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.artsy.net/api/artists/andy-warhol",
    "method": "GET",
    "xhrFields": {
                "withCredentials": true
            },
    "headers": {
      "x-xapp-token": "JvTPWe4WsQO-xqX6Bts49odGKiJo2bM7jYmadA9XZu1fiJos49Cx1pbq8Y4crkR_yoEblmajLq8rshz56kMdL-nKz1bl-3Wy_IQ6XoRUEdGxpZcx9StwPgKbST4rK5NHqAX6JI2xg4x3AkzFxEJ7pb_FiXa1p-krV9V2UGgAVwSlVNtlmcylV8WvEQ03UwIeyfGpMnb1fEaPkVWi4yoxMTXT6nw_BYkS0t8mgvXJ6wE=",
      "cache-control": "no-cache"
    }
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
  });

    $("#bton").click(function(){
        console.log(readCookie("artToken"));
    });
});
