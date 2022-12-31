const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");
const activityInput = document.getElementById("activity");
const submit = document.getElementById("submitBtn");
const cardContainer = document.getElementById("cards-container");
const mealsDetails = document.getElementById("details");
const ingredientSection = document.getElementById("ingredients");
const stepsSection = document.getElementById("steps");
const equipmentSection = document.getElementById("equipment");
// const API_KEY = "b7779b5e7b0c43b8a91ad41ad95688c9"
// const API_KEY = "3ce9298c607f4739a1349e61ece485fa";
const API_KEY = "98ba766b4a9949fe8c5600bc54b50220";

const getCalorie = () => {
  let hv = heightInput.value;
  let wv = weightInput.value;
  let av = ageInput.value;
  let gv = genderInput.value;
  let avv = activityInput.value;
  let bmr;
  if (gv === "female") {
    bmr = 655.1 + 9.563 * wv + 1.85 * hv - 4.676 * av;
  } else if (gv === "male") {
    bmr = 66.47 + 13.75 * wv + 5.003 * hv - 6.755 * av;
  }

  // Daily Calorie Requirement
  if (avv === "light") {
    bmr *= 1.375;
  } else if (avv === "moderate") {
    bmr *= 1.55;
  } else if (avv === "active") {
    bmr *= 1.725;
  }

  getMeals(bmr);
};

const getMeals = async (bmr) => {
  document.getElementById("loader").style.display = "block";
  const url = `https://api.spoonacular.com//mealplanner/generate?timeFrame=day&targetCalories=${bmr}&apiKey=${API_KEY}&includeNutrition=true`;

  let datas;
  await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      datas = data;
    });
  generateMealsCard(datas);
  document.getElementById("loader").style.display = "none";
};

const generateMealsCard = (datas) => {
  let cards = ``;
  mealsDetails.innerHTML = `
  <h1>Nutrients</h1>
  <div class="d-flex justify-content-center">
      <p class="px-2">Calories : ${datas?.nutrients?.calories}</p>
      <p class="px-2">Carbohydrates : ${datas.nutrients?.carbohydrates}</p>
      <p class="px-2">Fat : ${datas.nutrients?.fat}</p>
      <p class="px-2">Protein : ${datas.nutrients?.protein}</p>
  </div>
  `;
  datas.meals.map(async (data) => {
    const url = `https://api.spoonacular.com/recipes/${data.id}/information?apiKey=${API_KEY}&includeNutrition=false`;
    let imgURL;
    await fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        imgURL = data.image;
      });
    cards += `
        <div class="col-md-4 d-flex justify-content-center mb-2">
            <div class="card" style="width: 18rem;">
                <img src=${imgURL} class="card-img-top"
                    alt="meal 1">
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>
                    <p>Preparation Time - ${data.readyInMinutes}</p>
                    <button class="btn btn-outline-primary" onClick="btnRecipe(${data.id})" >Get Recipe</button>
                </div>
            </div>
        </div>
        `;
    cardContainer.innerHTML = cards;
  });
};

const btnRecipe = async (data) => {
  document.getElementById("loader").style.display = "block";

  ingredientSection.innerHTML = "";
  stepsSection.innerHTML = "";
  equipmentSection.innerHTML = "";
  const url = `https://api.spoonacular.com/recipes/${data}/information?apiKey=${API_KEY}&includeNutrition=false`;
  let information;

  await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      information = data;
    });

  //   Ingridents
  let htmlData = ``;
  let ul = document.createElement("ul");
  ul.classList.add("list-group");
  information.extendedIngredients.map((ingre) => {
    htmlData += `
        <li class="list-group-item ">${ingre.original}</li>
        `;
  });
  ul.innerHTML = htmlData;
  let ingreH1 = document.createElement("h1");
  ingreH1.textContent = "INGREDIENTS";
  ingreH1.classList.add("m-3", "text-center");
  ingredientSection.appendChild(ingreH1);
  ingredientSection.appendChild(ul);

  //   Steps
  let stepsHtml = ``;
  let stepsOl = document.createElement("ol");
  stepsOl.classList.add("list-group");
  information.analyzedInstructions[0].steps.map((step) => {
    stepsHtml += `
        <li>${step.step}</li>
        `;
  });
  stepsOl.innerHTML = stepsHtml;
  let stepsH1 = document.createElement("h1");
  stepsH1.textContent = "STEPS";
  stepsH1.classList.add("m-3", "text-center");
  stepsSection.appendChild(stepsH1);
  stepsSection.appendChild(stepsOl);

  // equipmentSection
  const urlEquip = `https://api.spoonacular.com/recipes/${data}/equipmentWidget.json?apiKey=${API_KEY}&includeNutrition=false`;
  let equip;

  await fetch(urlEquip)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      equip = data;
      console.log(equip);
    });

  let equipData = ``;
  let equipUl = document.createElement("ul");
  equipUl.classList.add("list-group");
  equip.equipment.map((equip) => {
    equipData += `
            <li class="list-group-item ">${equip.name}</li>
            `;
  });
  equipUl.innerHTML = equipData;
  let equipH1 = document.createElement("h1");
  equipH1.textContent = "EQUIPMENT";
  equipH1.classList.add("m-3", "text-center");
  equipmentSection.appendChild(equipH1);
  equipmentSection.appendChild(equipUl);

  document.getElementById("loader").style.display = "none";

};

submit.addEventListener("click", getCalorie);
