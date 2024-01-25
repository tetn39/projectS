function send() {
  var testId = "0CT1IgDYBnVSGFTA4pff7H";
  console.log("実行");
  var csrftoken = getCookie("csrftoken");
  fetch("/js_py_playlist/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    
    body: JSON.stringify({ selectedPlaylist: testId }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("jsから:", data.uris);
      console.log("pyから:", data.user_status);

      // status.htmlに遷移する
    //   window.location.href =
    //     "/status/?user_status=" +
    //     encodeURIComponent(JSON.stringify(data.user_status));
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

