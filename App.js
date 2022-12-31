const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");
const activityInput = document.getElementById("activity");
const submit = document.getElementById("submitBtn");
const cardContainer = document.getElementById("cards-container");
const mealsDetails = document.getElementById("details");
// const API_KEY = "b7779b5e7b0c43b8a91ad41ad95688c9"
const API_KEY = "3ce9298c607f4739a1349e61ece485fa"

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
  `
  datas.meals.map(async (data) => {
    const url = `https://api.spoonacular.com/recipes/${data.id}/information?apiKey=${API_KEY}&includeNutrition=false`;
    let imgURL;
    await fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data)
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
                    <button class="btn btn-outline-primary">Get Recipe</button>
                </div>
            </div>
        </div>
        `;
    cardContainer.innerHTML = cards;
  });
};

submit.addEventListener("click", getCalorie);
