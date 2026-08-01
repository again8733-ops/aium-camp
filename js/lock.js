(function () {
  var HASH = "hyjgtq2";
  var KEY = "aium_unlock";

  function hash(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) {
      h = ((h << 5) + h + str.charCodeAt(i)) & 0xffffffff;
    }
    return "h" + (h >>> 0).toString(36);
  }

  function check() {
    try { return sessionStorage.getItem(KEY) === HASH; }
    catch (e) { return false; }
  }

  function buildLock() {
    var div = document.createElement("div");
    div.className = "lock-screen";
    div.innerHTML =
      '<div class="lock-card">' +
      '<div class="lock-logo">에이아이<span>:</span>음</div>' +
      '<div class="lock-emoji">🔒</div>' +
      '<h2>비밀번호를 입력해주세요!</h2>' +
      '<p>4자리 숫자 암호를 입력하면 캠프 페이지가 열려요.</p>' +
      '<div class="lock-input-wrap">' +
      '<input type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" class="lock-input" placeholder="••••" autocomplete="off" />' +
      '</div>' +
      '<button class="lock-btn" type="button">열기 🔓</button>' +
      '<p class="lock-error" hidden>암호가 맞지 않아요! 다시 입력해주세요.</p>' +
      '</div>';
    document.body.appendChild(div);
    return div;
  }

  function unlock(lock) {
    try { sessionStorage.setItem(KEY, HASH); } catch (e) {}
    document.documentElement.style.overflow = "";
    lock.classList.add("unlocked");
    setTimeout(function () { lock.remove(); }, 550);
  }

  function init() {
    if (check()) return;

    var lock = buildLock();
    var input = lock.querySelector(".lock-input");
    var btn = lock.querySelector(".lock-btn");
    var err = lock.querySelector(".lock-error");
    document.documentElement.style.overflow = "hidden";
    input.focus();

    function tryUnlock() {
      if (hash(input.value) === HASH) {
        err.hidden = true;
        unlock(lock);
      } else {
        err.hidden = false;
        input.value = "";
        input.focus();
      }
    }

    btn.addEventListener("click", tryUnlock);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") tryUnlock();
    });
    input.addEventListener("input", function () {
      var v = input.value.replace(/\D/g, "").slice(0, 4);
      input.value = v;
      err.hidden = true;
      if (v.length === 4) tryUnlock();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
