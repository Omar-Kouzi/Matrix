let recipeData = [];
let currentIndex = 0;

let id = sessionStorage.getItem("recipeID");

fetch("./code/assets/data.json")
  .then((response) => response.json())
  .then((data) => {
    recipeData = data;

    // Find index instead of just recipe
    currentIndex = recipeData.findIndex(
      (recipe) => recipe.id == id
    );

    if (currentIndex !== -1) {
      displayRecipe(recipeData[currentIndex]);
    } else {
      console.error("Recipe not found:", id);
    }
  })
  .catch((error) => console.error("Error fetching data:", error));


// ================= NAVIGATION =================

function increasePage() {
  if (currentIndex < recipeData.length - 1) {
    currentIndex++;
    displayRecipe(recipeData[currentIndex]);
  }
}

function decreasePage() {
  if (currentIndex > 0) {
    currentIndex--;
    displayRecipe(recipeData[currentIndex]);
  }
}


// ================= DISPLAY =================

function displayRecipe(recipe) {
  const recipeContainer = document.getElementById("recipeContainer");
  if (!recipeContainer) return;

  recipeContainer.innerHTML = "";

  const recipeElement = document.createElement("div");

  recipeElement.innerHTML = `
  <div>
    <section>
      <h1 class="Recipe-Title">${recipe.title}</h1>
      <hr />
    </section>

    <section class="Mise-En-Place">
      <table class="styled-table">
        <thead>
          <tr>
            <th>Mise En Place</th>
            <th>Measurements</th>
          </tr>
        </thead>
        <tbody>
          ${recipe.ingredients.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <img src="${recipe.image}" alt="${recipe.title}" class="Mise-En-Place-img" />
    </section>

    <section class="Method">
      <h2>Method</h2>

      ${recipe.method.map(step => `
        <p   class="Method-step">
          ${step}
        </p>
      `).join("")}

      <div class="page-controls">
        <hr />
        <div class="quantity-control">
          <button onclick="decreasePage()">-</button>
          <p class="page"><b>${recipe.id}</b></p>
          <button onclick="increasePage()">+</button>
        </div>
      </div>
    </section>
  </div>
  `;

  recipeContainer.appendChild(recipeElement);
}