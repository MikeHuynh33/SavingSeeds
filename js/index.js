window.addEventListener("load", function () {
  //function to find how long it take to save up for downpayment in investing account.
  function display_final_result(content) {
    document.getElementById("Final_result").innerHTML = content;
  }
  function saving_account_compute_tine(
    saving,
    duration,
    downpayment,
    contribution,
    callback
  ) {
    let initial_compound = saving;
    let months = 0;
    let years_target = Math.ceil(downpayment / contribution) / 12;
    let text = "";
    for (let i = 1; i <= years_target; i++) {
      for (let y = 0; y < 12; y++) {
        initial_compound += contribution;
        months += 1;
        if (initial_compound >= downpayment) {
          break;
        }
      }
      if (initial_compound < downpayment) {
        initial_compound *= 1.08;
      }
    }
    // using callback to make sure all calculation completed before it display on html
    if (duration > months) {
      callback(
        "Congratulations, You are qualified for first home downpayment within " +
          months +
          " months"
      );
    } else if (duration < months) {
      callback(
        "Dont Give Up, You are so close to your dream home. You need to countine for another " +
          (months - duration) +
          " months"
      );
    }
  }

  // list of images that will change automatically on background page
  const images_sliding = [
    "./images/Toronto-morning.jpg",
    "./images/Toronto-moon.jpg",
    "./images/Toronto-evening.jpg",
    "./images/Toronto-night.jpg",
  ];
  // Variables
  var currentIndex = 0;
  var background = document.getElementById("background_change_image");
  let formData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateBirth: "",
    status: "",
    an_income: 0,
    debt: 0,
    saving: 0,
    contribution: 0,
    duration: 0,
    downpayment: 0,
  };
  const FHSA = 8000;
  const compound_rate = 0.08; // 8% per year.
  let TFSA_year_contribution_room = {
    2009: 5000,
    2010: 5000,
    2011: 5000,
    2012: 5000,
    2013: 5500,
    2014: 5500,
    2015: 10000,
    2016: 5500,
    2017: 5500,
    2018: 5500,
    2019: 6000,
    2020: 6000,
    2021: 6000,
    2022: 6000,
    2023: 6500,
  };
  // this function will give better quality when images switch , reload those images before it get used.
  function preloadImages() {
    for (var i = 0; i < images_sliding.length; i++) {
      var img = new Image();
      img.src = images_sliding[i];
    }
  }
  function convertStringToDouble(str) {
    return parseFloat(str.replace(/[^0-9.-]+/g, ""));
  }
  // validation function to check if it is not empty
  function isInputEmpty(inputValue) {
    if (inputValue.value === null || inputValue.value.trim() === "") {
      inputValue.focus();
      return true;
    } else {
      return false;
    }
  }
  // contribution prevent input"asdasdas22222" only take number "2222222" or "222222.22"
  function isInputEmpty_Number(inputValue) {
    console.log(!/^[0-9].+$/.test(inputValue.value.replace(/[$,]/g, "")));
    if (
      inputValue.value === null ||
      inputValue.value.trim() === "" ||
      !/^[0-9].+$/.test(inputValue.value.replace(/[$,]/g, ""))
    ) {
      inputValue.focus();
      return true;
    } else {
      return false;
    }
  }
  // validation function to check if it is not empty
  function isInputEmpty_saving_debt(inputValue) {
    if (inputValue.value === null || inputValue.value.trim() === "") {
      inputValue.value = 0;
      return false;
    } else {
      return false;
    }
  }
  // validation for Phone
  function validatePhone(phoneNumber) {
    const phoneRegex = /^\(\d{3}\)-\d{3}-\d{4}$/;

    if (phoneRegex.test(phoneNumber.value)) {
      return true; // phone number is valid
    } else {
      phoneNumber.focus();
      return false; // phone number is invalid
    }
  }
  // validation for Phone
  function validateEmail(email) {
    const phoneRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (phoneRegex.test(email.value)) {
      return true; // phone number is valid
    } else {
      email.focus();
      return false; // phone number is invalid
    }
  }
  // make fake loading bar
  function loading_bar() {
    var i = 0;
    if (i == 0) {
      i = 1;
      var elem = document.getElementById("loadingBar");
      var width = 1;
      var id = setInterval(loading, 100);
      function loading() {
        if (width >= 100) {
          clearInterval(id);
          elem.innerHTML = "Complete";
          loading_complete();
          i = 0;
        } else {
          width++;
          elem.style.width = width + "%";
          elem.innerHTML = width + "%";
        }
      }
    }
  }
  // calculate RRSP
  function RRSP_calculation(income) {
    return income * 0.18;
  }
  // calculate TFSA
  function TFSA_calculation(age) {
    const year_old = new Date(age);
    let contribution_room = 0;
    const turning_18_year = new Date(year_old.getFullYear() + 18, 0, 1);
    // Using Object key methods to find index.
    const keys = Object.keys(TFSA_year_contribution_room);
    keys.forEach((key, index) => {
      if (parseInt(key) >= turning_18_year.getFullYear()) {
        contribution_room += TFSA_year_contribution_room[key];
      }
    });
    return contribution_room;
  }
  // Format output for all details.
  function formatOutout(input) {
    const formattedAmount =
      "$" + input.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    return formattedAmount;
  }
  // Calculating the Saving Account.
  function saving_account_compute(contribution, duration, saving, debt) {
    return contribution * duration + saving - debt;
  }

  // Calculatinh the Investing Account.
  function investing_account_compute(contribution, duration, saving, debt) {
    const P = saving - debt; // initial savings
    const C = contribution; // monthly contribution
    const r = 0.08; // annual interest rate
    const n = 12; // number of compounding periods per year
    const t = duration / 12; // number of years

    const FV =
      P * Math.pow(1 + r / n, n * t) +
      C * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));

    console.log(FV.toFixed(2));
    return FV;
  }
  function loading_complete() {
    document.getElementById("finial_result_adviceflex").style.display = "none";
    document.getElementById("finial_result_analized").style.display = "flex";
    // Display user data from previous modal.
    document.getElementById("target_data").innerHTML = formatOutout(
      formData.downpayment
    );
    document.getElementById("contribution_data").innerHTML = formatOutout(
      formData.contribution
    );
    document.getElementById("duration_data").innerHTML =
      formData.duration + " months";
    // Calculating the room of tsfa rssp and fhsa.
    // I did double-check the result with my own TFSA , it was correct
    document.getElementById("tsfa_room").innerHTML = formatOutout(
      TFSA_calculation(formData.dateBirth)
    );
    // RRSP is required to the annual income of every years. So I just do 18% of this year according to Annual Income.
    document.getElementById("rssp_room").innerHTML =
      formatOutout(RRSP_calculation(formData.an_income)) +
      `/<span class="rrsp_year">this year<span>`;
    // FHSA just start this year, it would be 8k per year and up to 40k.
    document.getElementById("fhsa_room").innerHTML =
      formatOutout(FHSA) + `/<span class="rrsp_year">this year<span>`;
    // Display saving account = contribution * duration.
    document.getElementById("Saving_account").innerHTML = formatOutout(
      saving_account_compute(
        formData.contribution,
        formData.duration,
        formData.saving,
        formData.debt
      )
    );
    // Display investing account
    document.getElementById("Investing_account").innerHTML = formatOutout(
      investing_account_compute(
        formData.contribution,
        formData.duration,
        formData.saving,
        formData.debt
      )
    );
    // Display duration inside Saving Account after
    document.querySelector("#duration_savingaccount").innerHTML =
      formData.duration + "months";
    document.querySelector("#duration_investingaccount").innerHTML =
      formData.duration + "months";
  }
  // create background function , will be called inside setInterval for every 20s
  function changeBackground() {
    // simple math, to make sure the index increase by 1 and in range (images).
    currentIndex = (currentIndex + 1) % images_sliding.length;
    background.style.backgroundImage =
      "url('" + images_sliding[currentIndex] + "')";
  }
  preloadImages();
  // call interval for every 20s
  this.setInterval(changeBackground, 20000);
  console.log("url('../" + images_sliding[currentIndex] + "')");
  const btn_Next = document.getElementById("btn_Next");
  const btn_Next_two = document.getElementById("btn_Next_second");
  // First button clicked
  btn_Next.addEventListener("click", function (event) {
    // extract data from submit
    event.preventDefault();
    const f_name = document.querySelector("#f_name");
    const l_name = document.querySelector("#l_name");
    const date_birth = document.querySelector("#date_birth");
    const email = document.querySelector("#email");
    const phone = document.querySelector("#phone");
    // check input using validation function.
    if (
      isInputEmpty(f_name) ||
      isInputEmpty(l_name) ||
      !validateEmail(email) ||
      !validatePhone(phone) ||
      isInputEmpty(date_birth)
    ) {
    } else {
      // store data inside object names formData
      formData.firstName = f_name.value;
      formData.lastName = l_name.value;
      formData.email = email.value;
      formData.phone = phone.value;
      formData.dateBirth = date_birth.value;
      // let remove the first layer
      document.getElementById("modal_form_lay1").style.display = "none";
      document.getElementById("header").style.display = "none";
      // display next layer
      document.getElementById("modal_form_lay2").style.display = "flex";
      document.getElementById("username").innerText =
        formData.firstName + " " + formData.lastName;
    }
    console.log(formData);
  });
  // Second button clicked
  btn_Next_two.addEventListener("click", function (event) {
    event.preventDefault();
    // extract data from submit
    const status = document.querySelector('input[name="status"]:checked');
    const annualIncome = document.querySelector("#an_income");
    const debt = document.querySelector("#debt");
    const saving = document.querySelector("#saving");
    const contribution = document.querySelector("#contribution");
    const duration = document.querySelector("#duration");
    const downpayment = document.querySelector("#downpayment").innerHTML;
    const housevalue = document.querySelector("#valueHouse");
    // store data inside object names formData
    if (
      isInputEmpty(status) ||
      isInputEmpty_saving_debt(annualIncome) ||
      isInputEmpty_saving_debt(saving) ||
      isInputEmpty_saving_debt(debt) ||
      isInputEmpty_Number(contribution) ||
      isInputEmpty_Number(housevalue)
    ) {
    } else {
      // check input using validation function.
      formData.status = status.value;
      formData.an_income = convertStringToDouble(annualIncome.value);
      formData.debt = convertStringToDouble(debt.value);
      formData.saving = convertStringToDouble(saving.value);
      formData.contribution = convertStringToDouble(contribution.value);
      formData.duration = convertStringToDouble(duration.value);
      formData.downpayment = convertStringToDouble(downpayment);
      // display model 3 and hide
      document.getElementById("modal_form_lay2").style.display = "none";
      document.getElementById("modal_form_lay3").style.display = "flex";
      // call Calculation how much remainding time user need to reach their goal.
      saving_account_compute_tine(
        formData.saving,
        formData.duration,
        formData.downpayment,
        formData.contribution,
        display_final_result
      );
      loading_bar();
      console.log(formData);
    }
  });
  // the return btn clicked
  const btn_return = document.getElementById("btn_return");
  btn_return.addEventListener("click", function () {
    location.reload();
  });
});
