"use strict";

var steps = document.querySelectorAll(".stp");
var circleSteps = document.querySelectorAll(".step");
var formInputs = document.querySelectorAll(".step-1 form input");
var plans = document.querySelectorAll(".plan-card");
var switcher = document.querySelector(".switch");
var addons = document.querySelectorAll(".box");
var total = document.querySelector(".total b");
var planPrice = document.querySelector(".plan-price");
var time;
var currentStep = 1;
var currentCircle = 0;
var obj = {
  plan: null,
  kind: null,
  price: null
};
steps.forEach(function (step) {
  var nextBtn = step.querySelector(".next-stp");
  var prevBtn = step.querySelector(".prev-stp");

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      document.querySelector(".step-".concat(currentStep)).style.display = "none";
      currentStep--;
      document.querySelector(".step-".concat(currentStep)).style.display = "flex";
      circleSteps[currentCircle].classList.remove("active");
      currentCircle--;
    });
  }

  nextBtn.addEventListener("click", function () {
    document.querySelector(".step-".concat(currentStep)).style.display = "none";

    if (currentStep < 5 && validateForm()) {
      currentStep++;
      currentCircle++;
      setTotal();
    }

    document.querySelector(".step-".concat(currentStep)).style.display = "flex";
    circleSteps[currentCircle].classList.add("active");
    summary(obj);
  });
});

function summary(obj) {
  var planName = document.querySelector(".plan-name");
  var planPrice = document.querySelector(".plan-price");
  planPrice.innerHTML = "".concat(obj.price.innerText);
  planName.innerHTML = "".concat(obj.plan.innerText, " (").concat(obj.kind ? "yearly" : "monthly", ")");
}

function validateForm() {
  var valid = true;

  for (var i = 0; i < formInputs.length; i++) {
    if (!formInputs[i].value) {
      valid = false;
      formInputs[i].classList.add("err");
      findLabel(formInputs[i]).nextElementSibling.style.display = "flex";
    } else {
      valid = true;
      formInputs[i].classList.remove("err");
      findLabel(formInputs[i]).nextElementSibling.style.display = "none";
    }
  }

  return valid;
}

function findLabel(el) {
  var idVal = el.id;
  var labels = document.getElementsByTagName("label");

  for (var i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor == idVal) return labels[i];
  }
}

plans.forEach(function (plan) {
  plan.addEventListener("click", function () {
    document.querySelector(".selected").classList.remove("selected");
    plan.classList.add("selected");
    var planName = plan.querySelector("b");
    var planPrice = plan.querySelector(".plan-priced");
    obj.plan = planName;
    obj.price = planPrice;
  });
});
switcher.addEventListener("click", function () {
  var val = switcher.querySelector("input").checked;

  if (val) {
    document.querySelector(".monthly").classList.remove("sw-active");
    document.querySelector(".yearly").classList.add("sw-active");
  } else {
    document.querySelector(".monthly").classList.add("sw-active");
    document.querySelector(".yearly").classList.remove("sw-active");
  }

  switchPrice(val);
  obj.kind = val;
});
addons.forEach(function (addon) {
  addon.addEventListener("click", function (e) {
    var addonSelect = addon.querySelector("input");
    var ID = addon.getAttribute("data-id");

    if (addonSelect.checked) {
      addonSelect.checked = false;
      addon.classList.remove("ad-selected");
      showAddon(ID, false);
    } else {
      addonSelect.checked = true;
      addon.classList.add("ad-selected");
      showAddon(addon, true);
      e.preventDefault();
    }
  });
});

function switchPrice(checked) {
  var yearlyPrice = [90, 120, 150];
  var monthlyPrice = [9, 12, 15];
  var prices = document.querySelectorAll(".plan-priced");

  if (checked) {
    prices[0].innerHTML = "$".concat(yearlyPrice[0], "/yr");
    prices[1].innerHTML = "$".concat(yearlyPrice[1], "/yr");
    prices[2].innerHTML = "$".concat(yearlyPrice[2], "/yr");
    setTime(true);
  } else {
    prices[0].innerHTML = "$".concat(monthlyPrice[0], "/mo");
    prices[1].innerHTML = "$".concat(monthlyPrice[1], "/mo");
    prices[2].innerHTML = "$".concat(monthlyPrice[2], "/mo");
    setTime(false);
  }
}

function showAddon(ad, val) {
  var temp = document.getElementsByTagName("template")[0];
  var clone = temp.content.cloneNode(true);
  var serviceName = clone.querySelector(".service-name");
  var servicePrice = clone.querySelector(".servic-price");
  var serviceID = clone.querySelector(".selected-addon");

  if (ad && val) {
    serviceName.innerText = ad.querySelector("label").innerText;
    servicePrice.innerText = ad.querySelector(".price").innerText;
    serviceID.setAttribute("data-id", ad.dataset.id);
    document.querySelector(".addons").appendChild(clone);
  } else {
    var _addons = document.querySelectorAll(".selected-addon");

    _addons.forEach(function (addon) {
      var attr = addon.getAttribute("data-id");

      if (attr == ad) {
        addon.remove();
      }
    });
  }
}

function setTotal() {
  var str = planPrice.innerHTML;
  var res = str.replace(/\D/g, "");
  var addonPrices = document.querySelectorAll(".selected-addon .servic-price");
  var val = 0;

  for (var i = 0; i < addonPrices.length; i++) {
    var _str = addonPrices[i].innerHTML;

    var _res = _str.replace(/\D/g, "");

    val += Number(_res);
  }

  total.innerHTML = "$".concat(val + Number(res), "/").concat(time ? "yr" : "mo");
}

function setTime(t) {
  return time = t;
}