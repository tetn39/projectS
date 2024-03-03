document.addEventListener('DOMContentLoaded', function() {
  const items = document.querySelectorAll('.item-list');
  let visibleCount = 4; // 初期表示項目数

  // 最初の表示項目数以降のアイテムに.hiddenクラスを追加して非表示にする
  for (let i = visibleCount; i < items.length; i++) {
    items[i].classList.add('hidden');
  }

  const openBtn = document.querySelector('.open-btn');
  if (openBtn) {
    openBtn.addEventListener('click', function() {
      const nextEndIndex = visibleCount + 4;
      for (let i = visibleCount; i < nextEndIndex && i < items.length; i++) {
        items[i].classList.remove('hidden'); // .hiddenクラスを削除して表示
      }
      visibleCount += 4; // 表示済みのカウントを更新

      if (visibleCount >= items.length) {
        openBtn.classList.add('hidden'); // すべて表示したらボタンを非表示に
      }
    });
  }

  // アイテムの総数が4以下の場合はボタンを非表示に（.hiddenクラスを追加）
  if (items.length <= 4) {
    openBtn.classList.add('hidden');
  }
});


function send(selectedId) {
  console.log("実行");
  console.log("selectedId:", selectedId);
  var csrftoken = getCookie("csrftoken");
  fetch("/js_py_playlist/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    
    body: JSON.stringify({ selectedPlaylist: selectedId }),
  })

    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      console.log("jsから:", data.uris);
      console.log("pyから:", data.user_status);
      console.log("pyから:", data.recommended_music);
      console.log("pyから:", data.diagnosis_id);
      // status.htmlに遷移する
      window.location.href =
        "/status/?diagnosis_id=" +
        data.diagnosis_id;
    })
    .catch((error) => {
      console.error("Error:", error);
      // エラーメッセージを取得
      var errorMessage = error.message;
      // エラーが発生した箇所を取得
      var errorStack = error.stack;
      // 送信データを取得
      var sendData = JSON.stringify({ selectedPlaylist: selectedId });

      // コンソールに出力
      console.log("errorMessage:", errorMessage);
      console.log("errorStack:", errorStack);
      console.log("sendData:", sendData);
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

