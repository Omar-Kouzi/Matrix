(function () {
  let recipesData = [];

  fetch("/recipes")
    .then((res) => res.json())
    .then((data) => {
      recipesData = data;
      displayRecipes(recipesData);
    });

  function GotoRecipe(recipeid) {
    sessionStorage.recipeID = recipeid;
  }

  // DISPLAY
  function displayRecipes(recipes) {
    const container = document.getElementById("recipesContainer");
    container.innerHTML = "";

    recipes.forEach((recipe) => {
      const card = document.createElement("div");
      card.id = "recipe";

      card.classList.add(recipe.aproved === "true" ? "aproved" : "not-aproved");

      card.innerHTML = `
      <div class="recipeimg-container">
        <img src="${recipe.image || "https://placehold.jp/150x150.png"}" class="recipeimg"/>
      </div>

      <h5>${recipe.title}</h5>

      <button>
        <a href="../pages/recipe.html"
           class="nava"
           data-page="recipe">
           View
        </a>
      </button>
    `;

      card.querySelector("a").onclick = () => {
        GotoRecipe(recipe.id);
      };

      container.appendChild(card);
    });
  }

  // FILTER
  function filterAndSortRecipes() {
    const searchTerm = document
      .getElementById("filterInput")
      .value.toLowerCase()
      .trim();

    const sortMethod = document.getElementById("sortSelect").value;

    const aprovedFilter = document.getElementById("aprovedFilter").checked;

    let filtered = recipesData.filter((recipe) => {
      const titleMatch = recipe.title.toLowerCase().includes(searchTerm);

      const ingredientMatch = recipe.ingredients?.some((i) =>
        i.name.toLowerCase().includes(searchTerm),
      );

      const matchesSearch = titleMatch || ingredientMatch;

      const matchesApproved = aprovedFilter ? recipe.aproved === "true" : true;

      return matchesSearch && matchesApproved;
    });

    // SORT
    if (sortMethod === "az")
      filtered.sort((a, b) => a.title.localeCompare(b.title));

    if (sortMethod === "za")
      filtered.sort((a, b) => b.title.localeCompare(a.title));

    if (sortMethod === "aproved")
      filtered.sort(
        (a, b) => (a.aproved === "false") - (b.aproved === "false"),
      );

    displayRecipes(filtered);
  }

  // EVENTS
  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    filterAndSortRecipes();
  });

  document
    .getElementById("sortSelect")
    .addEventListener("change", filterAndSortRecipes);

  document
    .getElementById("aprovedFilter")
    .addEventListener("change", filterAndSortRecipes);

  document
    .getElementById("filterInput")
    .addEventListener("input", filterAndSortRecipes);
})();
