document.addEventListener("DOMContentLoaded", () => {
  // DOM selections and global variables
  const employees = [];
  const gallery = document.getElementById("gallery");
  const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
  email, location, cell, dob &noinfo &nat=US`;

  /* --------------------------
     Search Bar Functionality
  --------------------------------*/

  /**
   * Creates SearchBar HTML and inserts it to the page
   */

  const generateSearchHTML = () => {
    const searchContainer = document.querySelector(".js-search-container");
    const form = `<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`;

    searchContainer.insertAdjacentHTML("beforeend", form);
  };

  generateSearchHTML();

  // ------------------------------------------
  //  FETCH FUNCTIONS
  // ------------------------------------------

  const fetchData = (url) => {
    return fetch(url)
      .then(checkStatus)
      .then((res) => res.json())
      .catch((err) => console.log("Looks like there was a Problem", err));
  };

  function checkStatus(res) {
    if (res.ok) {
      return Promise.resolve(res);
    } else {
      generateErrorMsg(res.status, res.statusText);
      return Promise.reject(new Error(res.statusText));
    }
  }

  //Create error message html seen if the api data fails to load
  function generateErrorMsg(status, statusText) {
    const msg = `
              <div class="error-msg">
                  <h2>${status} ${statusText}</h2>
                  <p>There was a problem receiving the employee data. Please try again later.</p>
              </div>
          `;
    gallery.insertAdjacentHTML("beforebegin", msg);
  }

  //Api call
  fetchData(urlAPI).then((data) => {
    employees.push(...data.results);
    generateEmployHTML(employees);
  });

  /* --------------------------
     Employee Gallery Section
  --------------------------------*/

  /**
   * Creates Employee HTML and inserts it into the #gallery section of the page
   * @param {array} - employees
   */

  const generateEmployHTML = (employees) => {
    const employeeHTML = employees
      .map((employee, idx) => {
        return `<div class="card" data-index="${idx}">
                    <div class="card-img-container">
                        <img class="card-img" src="${employee.picture.large}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                        <p class="card-text">${employee.email}</p>
                        <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                    </div>
                </div>`;
      })
      .join("");

    gallery.insertAdjacentHTML("afterbegin", employeeHTML);
  };

  /* --------------------------
    Modal
  --------------------------------*/

  /**
   * Creates modal HTML
   * @param {array} - employees array
   * @param {idx} - number
   * @return {string} - html
   */

  const generatModal = (employees, idx) => {
    const employee = employees[idx];
    let date = new Date(employee.dob.date);
    let birthday =
      ("0" + date.getMonth()).slice(-2) +
      "/" +
      ("0" + (date.getDay() + 1)).slice(-2) +
      "/" +
      date.getYear();

    return ` <div class="modal" >
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
            <p class="modal-text">${employee.email}</p>
            <p class="modal-text cap">${employee.location.city}</p>
            <hr>
            <p class="modal-text">${employee.cell}</p>
            <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}., ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
            <p class="modal-text">Birthday: ${birthday}</p>
        </div>
    </div>
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div> `;
  };

  //   adds modal container to the DOM
  gallery.insertAdjacentHTML(
    "afterend",
    `<div class="modal-container js-modal hide"></div>`
  );

  /* --------------------------
    event handlers
  --------------------------------*/
  const modalContainer = document.querySelector(".js-modal");

  const displayModal = (evt) => {
    if (evt.target !== gallery) {
      const employIdx = parseInt(evt.target.closest(".card").dataset.index);
      modalContainer.innerHTML = generatModal(employees, employIdx);
      modalContainer.classList.remove("hide");
      modalContainer.dataset.index = employIdx;
    }
  };

  /**
   * Changes the modal information and closes the modal
   * @param {evt} - click event
   */

  const handleModalChange = (evt) => {
    const btn = evt.target;
    let idx = parseInt(modalContainer.dataset.index);

    // close modal functionality
    if (btn.textContent === "X") {
      modalContainer.classList.add("hide");
    }

    if (btn.classList.contains("modal-prev")) {
      idx--;
      if (idx < 0) {
        idx = employees.length - 1;
      }
    }

    if (btn.classList.contains("modal-next")) {
      idx++;
      if (idx > employees.length - 1) {
        idx = 0;
      }
    }

    // Update modal information
    modalContainer.dataset.index = idx;
    modalContainer.innerHTML = generatModal(employees, idx);
  };

  /**
   * handles search functioality
   * @param {evt} - keyup event
   */

  const handleSearch = (evt) => {
    const cards = document.querySelectorAll(".card");
    const search = evt.target.value.toLowerCase();

    cards.forEach((card) => {
      let name =
        card.lastElementChild.firstElementChild.textContent.toLowerCase();

      if (!name.includes(search)) {
        card.style.display = "none";
      } else {
        card.style.display = "";
      }
    });
  };

  /* --------------------------
    event listeners
  --------------------------------*/

  gallery.addEventListener("click", displayModal);
  modalContainer.addEventListener("click", handleModalChange);
  document.querySelector("form").addEventListener("keyup", handleSearch);
  document.querySelector("form").addEventListener("search", handleSearch);
});
