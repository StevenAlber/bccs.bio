// BCCS evidence services: the menu on narrow windows, the request form and the readiness checklist.
// Every page reads and works without this file; it only adds to what the HTML already does.
(function () {
  "use strict";
  var doc = document;

  // ---- events for a counting service, when the owner has switched one on --------------------------------
  function count(name) {
    try {
      if (typeof window.plausible === "function") window.plausible(name);
      if (window.goatcounter && typeof window.goatcounter.count === "function") window.goatcounter.count({ path: "event/" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), title: name, event: true });
    } catch (err) {
      /* a counting service must never break the page */
    }
  }
  doc.addEventListener("click", function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest("a[href]") : null;
    if (!a) return;
    if (a.hostname === "observatory.bccs.bio") count("Observatory opened");
    else if (a.protocol === "mailto:") count("Email link used");
  });

  // ---- menu ---------------------------------------------------------------------------------------------
  var btn = doc.querySelector(".menu-btn");
  var nav = doc.getElementById("site-nav");
  if (btn && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.querySelector(".menu-btn__label").textContent = open ? "Close" : "Menu";
    };
    btn.addEventListener("click", function () {
      setOpen(btn.getAttribute("aria-expanded") !== "true");
    });
    doc.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        btn.focus();
      }
    });
    if (window.matchMedia) {
      var wide = window.matchMedia("(min-width: 941px)");
      var onWide = function () {
        if (wide.matches) setOpen(false);
      };
      if (wide.addEventListener) wide.addEventListener("change", onWide);
      else if (wide.addListener) wide.addListener(onWide);
    }
  }

  // ---- the readiness checklist ----------------------------------------------------------------------------
  var checklist = doc.querySelector("form[data-checklist]");
  if (checklist) {
    var result = doc.getElementById("checklist-result");
    var summaryText = "";
    checklist.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var groups = { yes: [], partly: [], no: [], open: [] };
      checklist.querySelectorAll("[data-item]").forEach(function (item) {
        var picked = item.querySelector("input:checked");
        groups[picked ? picked.value : "open"].push(item.getAttribute("data-item"));
      });
      var total = groups.yes.length + groups.partly.length + groups.no.length + groups.open.length;
      var block = function (title, items) {
        if (!items.length) return "";
        return "<h3>" + title + " (" + items.length + ")</h3><ul>" + items.map(function (t) { return "<li>" + t.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</li>"; }).join("") + "</ul>";
      };
      var lines = ["Evidence readiness checklist, as answered on " + new Date().toISOString().slice(0, 10) + " (" + total + " points)"];
      [["In place", groups.yes], ["Partly in place", groups.partly], ["Not in place", groups.no], ["Not answered", groups.open]].forEach(function (pair) {
        if (!pair[1].length) return;
        lines.push("", pair[0] + ":");
        pair[1].forEach(function (t) { lines.push("- " + t); });
      });
      summaryText = lines.join("\n");
      result.querySelector("[data-out]").innerHTML =
        "<p>" + groups.yes.length + " of " + total + " points are in place by your own account. This is a list of what you answered, not an assessment of your evidence.</p>" +
        block("Not in place", groups.no) + block("Partly in place", groups.partly) + block("Not answered", groups.open) + block("In place", groups.yes);
      result.hidden = false;
      result.focus();
      count("Checklist completed");
    });
    var send = doc.getElementById("checklist-send");
    if (send) {
      send.addEventListener("click", function () {
        try { window.sessionStorage.setItem("bccs-checklist", summaryText); } catch (err) { /* private windows may refuse storage; the request page then starts empty */ }
      });
    }
  }

  // ---- the request form -----------------------------------------------------------------------------------
  var form = doc.querySelector("form[data-enquiry]");
  if (!form) return;
  var loadedAt = Date.now();
  var endpoint = form.getAttribute("data-endpoint") || "";
  var address = form.getAttribute("data-email");
  var status = doc.getElementById("enquiry-status");
  var submit = form.querySelector('button[type="submit"]');
  var message = form.elements.message;

  // A choice made on another page arrives in the address: /contact.html?need=review
  var params = new URLSearchParams(window.location.search);
  if (params.get("need") && form.elements.need) {
    Array.prototype.forEach.call(form.elements.need.options, function (o) { if (o.value === params.get("need")) form.elements.need.value = o.value; });
  }
  if (params.get("from") === "checklist") {
    try {
      var kept = window.sessionStorage.getItem("bccs-checklist");
      if (kept && !message.value) message.value = "\n\n" + kept;
    } catch (err) { /* nothing kept */ }
  }

  function fieldError(el, text) {
    var slot = doc.getElementById(el.id + "-error");
    el.setAttribute("aria-invalid", text ? "true" : "false");
    if (slot) slot.textContent = text || "";
  }

  function validate() {
    var first = null;
    var need = [["name", "Give your name."], ["email", "Give an email address we can reply to."], ["institution", "Name your organisation, or write “independent”."], ["message", "Describe the site, the claim and the decision it feeds, in a few sentences."]];
    need.forEach(function (pair) {
      var el = form.elements[pair[0]];
      var value = el.value.trim();
      var bad = !value || (pair[0] === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) || (pair[0] === "message" && value.length < 20);
      fieldError(el, bad ? pair[1] : "");
      if (bad && !first) first = el;
    });
    return first;
  }

  function collect() {
    var data = { form: "bccs-enquiry", page: window.location.pathname };
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === "submit") return;
      data[el.name] = el.value.trim();
      if (el.tagName === "SELECT" && el.value) data[el.name + "_label"] = el.options[el.selectedIndex].text;
    });
    return data;
  }

  function asText(data) {
    var rows = [["Name", data.name], ["Email", data.email], ["Organisation", data.institution], ["Role", data.role], ["Request", data.need_label], ["Country or region", data.region], ["Number of sites", data.sites_label], ["The result is for", data.use_label], ["Needed by", data.timeline_label], ["Budget band", data.budget_label]];
    var head = rows.filter(function (r) { return r[1]; }).map(function (r) { return r[0] + ": " + r[1]; });
    return head.join("\n") + "\n\n" + data.message + "\n";
  }

  function showDraft(data, why) {
    var text = asText(data);
    var subject = "BCCS request: " + (data.need_label || "enquiry") + " (" + data.institution + ")";
    var full = "mailto:" + address + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
    // Some mail programs cut a long address short. Then the text travels by copy and paste instead.
    var fits = full.length < 1900;
    var href = fits ? full : "mailto:" + address + "?subject=" + encodeURIComponent(subject);
    status.innerHTML = "";
    var box = doc.createElement("div");
    box.className = "note note--plain draft";
    box.setAttribute("tabindex", "-1");
    box.innerHTML =
      "<h3>" + (why || "Your request is written. It has not been sent yet.") + "</h3>" +
      "<p>Send it from your own mail to <strong>" + address + "</strong>. " + (fits ? "The button opens your mail program with the text filled in." : "The text is long: copy it, open your mail program with the button and paste it in.") + " Nothing leaves this page until you press send there.</p>" +
      '<p class="actions" style="margin-top:0"><a class="btn" data-open href="' + href.replace(/"/g, "&quot;") + '">Open in your mail program</a><button type="button" class="btn btn--ghost" data-copy>Copy the text</button></p>' +
      "<pre></pre>";
    box.querySelector("pre").textContent = "To: " + address + "\nSubject: " + subject + "\n\n" + text;
    box.querySelector("[data-copy]").addEventListener("click", function (ev) {
      var done = function () { ev.target.textContent = "Copied"; };
      var all = box.querySelector("pre").textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(all).then(done, function () { window.prompt("Copy the text:", all); });
      else window.prompt("Copy the text:", all);
    });
    status.appendChild(box);
    box.focus();
    count("Request written as email");
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var bad = validate();
    if (bad) {
      bad.focus();
      return;
    }
    var data = collect();
    // The hidden field is never filled by a person, and nobody fills this form in under three seconds.
    if (data.website || Date.now() - loadedAt < 3000) {
      status.innerHTML = '<p class="note note--refuse">This did not go through. Please wait a moment and try again, or write to ' + address + ".</p>";
      return;
    }
    delete data.website;
    if (!endpoint) {
      showDraft(data);
      return;
    }
    var label = submit.textContent;
    submit.disabled = true;
    submit.textContent = "Sending…";
    status.innerHTML = "";
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) { return res.ok && body && body.ok === true; });
      })
      .catch(function () { return false; })
      .then(function (ok) {
        submit.disabled = false;
        submit.textContent = label;
        if (!ok) {
          showDraft(data, "The form service did not confirm receipt, so nothing was sent.");
          return;
        }
        form.reset();
        status.innerHTML = '<div class="note note--plain" tabindex="-1"><h3>Received.</h3><p>You will have a written reply from ' + address + " within " + (form.getAttribute("data-reply") || "two working days") + ". If none arrives, write to that address directly: a missing reply means something failed on our side.</p></div>";
        status.firstChild.focus();
        count("Request sent");
      });
  });
})();
