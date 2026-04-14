(function () {
  let recipesData = [];

  const defaultImage = "https://placehold.jp/150x150.png";

  const searchInput = document.getElementById("editSearch");
  const resultsBox = document.getElementById("editSearchResults");

  const ingredientsContainer = document.getElementById("ingredientsContainer");
  const methodContainer = document.getElementById("methodContainer");

  const imageFile = document.getElementById("imageFile");
  const imagePreview = document.getElementById("imagePreview");

  // LOAD
  fetch("/recipes")
    .then((res) => res.json())
    .then((data) => (recipesData = data));

  // SEARCH
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

    const results = recipesData.filter((r) =>
      r.title.toLowerCase().includes(term),
    );

    displaySearchResults(results);
  }

  function displaySearchResults(recipes) {
    resultsBox.innerHTML = "";

    recipes.forEach((recipe) => {
      const card = document.createElement("div");

      card.innerHTML = `
      <div class="recipeimg-container">
        <img src="${recipe.image || defaultImage}" class="recipeimg"/>
      </div>

      <h5>${recipe.title}</h5>

      <button class="select-btn">Select</button>
    `;

      card.querySelector(".select-btn").onclick = () => {
        loadRecipeToForm(recipe.id);
      };

      resultsBox.appendChild(card);
    });
  }

  // LOAD INTO FORM
  function loadRecipeToForm(id) {
    const recipe = recipesData.find((r) => r.id == id);
    if (!recipe) return;

    document.getElementById("editID").value = recipe.id;
    document.getElementById("form-title").value = recipe.title;
    document.getElementById("approved").checked = recipe.aproved === "true";

    imagePreview.src = recipe.image || defaultImage;

    loadIngredients(recipe.ingredients || []);
    loadMethods(recipe.method || []);

    searchInput.value = "";
    resultsBox.innerHTML = "";
  }

  // INGREDIENTS
  document.getElementById("addIngredientBtn").onclick = () =>
    addIngredientRow();

  function addIngredientRow(name = "", qty = "") {
    const row = document.createElement("div");

    row.className = "ingredient-row";

    row.innerHTML = `
    <input class="ingredient-name" value="${name}" />
    <input class="ingredient-qty" value="${qty}" />
    <button type="button">✖</button>
  `;

    row.querySelector("button").onclick = () => row.remove();

    ingredientsContainer.appendChild(row);
  }

  function loadIngredients(ingredients) {
    ingredientsContainer.innerHTML = "";
    ingredients.forEach((i) => addIngredientRow(i.name, i.quantity));
  }

  // METHODS
  document.getElementById("addMethodBtn").onclick = () => addMethodRow();

  function addMethodRow(step = "") {
    const row = document.createElement("div");

    row.className = "method-row";

    row.innerHTML = `
    <input class="method-step" value="${step}" />
    <button type="button">✖</button>
  `;

    row.querySelector("button").onclick = () => row.remove();

    methodContainer.appendChild(row);
  }

  function loadMethods(method) {
    methodContainer.innerHTML = "";
    method.forEach((step) => addMethodRow(step));
  }

  // IMAGE
  imageFile.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => (imagePreview.src = e.target.result);
      reader.readAsDataURL(file);
    }
  });

  // SAVE
  document
    .getElementById("editRecipeForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const id = document.getElementById("editID").value;
      const title = document.getElementById("form-title").value;
      const approved = document.getElementById("approved").checked;

      const ingredients = [];
      document.querySelectorAll(".ingredient-row").forEach((row) => {
        ingredients.push({
          name: row.querySelector(".ingredient-name").value,
          quantity: row.querySelector(".ingredient-qty").value,
        });
      });

      const method = [];
      document.querySelectorAll(".method-row").forEach((row) => {
        const step = row.querySelector(".method-step").value.trim();
        if (step) method.push(step);
      });

      const updatedRecipe = {
        id,
        title,
        image: imagePreview.src,
        ingredients,
        method,
        aproved: approved ? "true" : "false",
        catigories: ["dessert"],
      };

      fetch("/recipes/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecipe),
      }).then(() => alert("Updated ✅"));
    });
})();
