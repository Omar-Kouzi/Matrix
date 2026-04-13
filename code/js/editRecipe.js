let recipesData = [];

const defaultImage = "https://placehold.jp/150x150.png";

const searchInput = document.getElementById("editSearch");
const resultsBox = document.getElementById("editSearchResults");

const ingredientsContainer = document.getElementById("ingredientsContainer");

const imageFile = document.getElementById("imageFile");

const imagePreview = document.getElementById("imagePreview");

// ================= LOAD RECIPES =================

fetch("/recipes")
  .then((res) => res.json())
  .then((data) => {
    recipesData = data;
  });

// ================= SEARCH BUTTON =================
document
  .getElementById("searchRecipeBtn")
  .addEventListener("click", searchRecipes);

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchRecipes();
  }
});

function searchRecipes() {
  const term = searchInput.value.toLowerCase().trim();

  if (!term) {
    resultsBox.innerHTML = "";
    return;
  }

  const results = recipesData.filter((recipe) =>
    recipe.title.toLowerCase().includes(term),
  );

  displaySearchResults(results);
}
// ================= DISPLAY SEARCH RESULTS =================

function displaySearchResults(recipes) {
  resultsBox.innerHTML = "";

  recipes.forEach((recipe) => {
    const card = document.createElement("div");

    card.id = "recipe";

    card.innerHTML = `
  <div class="recipeimg-container">
        <img 
          src="${recipe.image || "https://placehold.jp/150x150.png"}" 
          alt="img" 
          class="recipeimg" 
        />
      </div>

      <h5>${recipe.title}</h5>
    
<button onclick="loadRecipeToForm('${recipe.id}')">
Select
      </button>
</div>
`;

    resultsBox.appendChild(card);
  });
}

// ================= LOAD TO FORM =================

function loadRecipeToForm(id) {
  const recipe = recipesData.find((r) => r.id == id);

  if (!recipe) return;

  document.getElementById("editID").value = recipe.id;

  document.getElementById("title").value = recipe.title;

  document.getElementById("approved").checked = recipe.aproved === "true";

  imagePreview.src = recipe.image || defaultImage;

  loadIngredients(recipe.ingredients || []);

  // clear search
  searchInput.value = "";
  resultsBox.innerHTML = "";
}

// ================= INGREDIENTS =================

document
  .getElementById("addIngredientBtn")
  .addEventListener("click", () => addIngredientRow());

function addIngredientRow(name = "", qty = "") {
  const row = document.createElement("div");

  row.className = "ingredient-row";

  row.innerHTML = `
<input 
class="ingredient-name"
placeholder="Ingredient"
value="${name}"
/>

<input 
class="ingredient-qty"
placeholder="Quantity"
value="${qty}"
/>

<button type="button" class="remove">
✖
</button>
`;

  row.querySelector(".remove").onclick = () => row.remove();

  ingredientsContainer.appendChild(row);
}

function loadIngredients(ingredients) {
  ingredientsContainer.innerHTML = "";

  ingredients.forEach((i) => addIngredientRow(i.name, i.quantity));
}

// ================= IMAGE PREVIEW =================

imageFile.addEventListener("change", function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => (imagePreview.src = e.target.result);

    reader.readAsDataURL(file);
  }
});

// ================= SAVE =================

document
  .getElementById("editRecipeForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("editID").value;

    const title = document.getElementById("title").value;

    const approved = document.getElementById("approved").checked;

    const ingredients = [];

    document.querySelectorAll(".ingredient-row").forEach((row) => {
      ingredients.push({
        name: row.querySelector(".ingredient-name").value,
        quantity: row.querySelector(".ingredient-qty").value,
      });
    });

    const updatedRecipe = {
      id,
      title,
      image: imagePreview.src,
      ingredients,

      method: ["", "", ""],

      aproved: approved ? "true" : "false",

      catigories: ["dessert"],
    };

    fetch("/recipes/update", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(updatedRecipe),
    }).then(() => alert("Recipe Updated ✅"));
  });
