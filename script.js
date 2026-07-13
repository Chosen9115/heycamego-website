/* ============================================================
   Carlos Medellin — personal site
   Web3Forms AJAX submit + small niceties
   ============================================================ */
(function () {
  "use strict";

  /* current year in footer */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- email capture via Web3Forms (no redirect) ---- */
  var form = document.getElementById("signup-form");
  var result = document.getElementById("form-result");
  if (!form || !result) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var button = form.querySelector(".form__button");
    var originalLabel = button ? button.innerHTML : "";
    if (button) {
      button.disabled = true;
      button.textContent = "Sending\u2026";
    }

    var data = new FormData(form);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data
    })
      .then(function (response) {
        return response.json().then(function (json) {
          return { ok: response.ok, json: json };
        });
      })
      .then(function (res) {
        if (res.ok && res.json.success) {
          showSuccess();
        } else {
          showError(button, originalLabel);
        }
      })
      .catch(function () {
        showError(button, originalLabel);
      });
  });

  function showSuccess() {
    form.hidden = true;
    var note = document.querySelector(".capture__note");
    if (note) note.hidden = true;

    result.hidden = false;
    result.innerHTML =
      '<span class="tag">[ CONFIRMED ]</span>' +
      "You&rsquo;re on the list. The 50 Things guide is on its way to your inbox.";
    result.focus && result.focus();
  }

  function showError(button, originalLabel) {
    if (button) {
      button.disabled = false;
      button.innerHTML = originalLabel;
    }
    result.hidden = false;
    result.style.color = "#c8331e";
    result.innerHTML =
      '<span class="tag" style="color:#c8331e">[ ERROR ]</span>' +
      "Something went wrong. Please try again, or email me directly.";
  }
})();
