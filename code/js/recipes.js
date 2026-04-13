let recipesData = [];

fetch("/recipes")
  .then((response) => response.json())
  .then((data) => {
    recipesData = data;
    displayRecipes(recipesData);
  })
  .catch((error) =>
    console.error("Error fetching data:", error)
  );

function GotoRecipe(recipeid) {
  sessionStorage.recipeID = recipeid;
  console.log(recipeid);
}

function displayRecipes(recipes) {
  const recipesContainer =
    document.getElementById("recipesContainer");

  recipesContainer.innerHTML = "";

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.id = "recipe";

    if (recipe.aproved === "true") {
      recipeCard.classList.add("aproved");
    } else {
      recipeCard.classList.add("not-aproved");
    }

    recipeCard.innerHTML = `
      <div class="recipeimg-container">
        <img 
          src="${recipe.image || 'https://placehold.jp/150x150.png'}" 
          alt="img" 
          class="recipeimg" 
        />
      </div>

      <h5>${recipe.title}</h5>
    
      <button>    
        <a 
          href="../pages/recipe.html" 
          class="nava" 
          data-page="recipe" 
          onClick="GotoRecipe('${recipe.id}')"
        >
          Buy Now
        </a>
      </button>
    `;

    recipesContainer.appendChild(recipeCard);
  });
}


// ================= FILTER =================

function filterAndSortRecipes() {
  const searchTerm = document
    .getElementById("filterInput")
    .value.toLowerCase()
    .trim();

  const sortMethod =
    document.getElementById("sortSelect").value;

  const aprovedFilter =
    document.getElementById("aprovedFilter").checked;

  let filteredRecipes =
    recipesData.filter((recipe) => {

      const titleMatch =
        recipe.title
          .toLowerCase()
          .includes(searchTerm);

      const ingredientMatch =
        recipe.ingredients?.some((ing) =>
          ing.name
            .toLowerCase()
            .includes(searchTerm)
        );

      const matchesSearchTerm =
        titleMatch || ingredientMatch;

      const matchesaprovedFilter =
        aprovedFilter
          ? recipe.aproved === "true"
          : true;

      return (
        matchesSearchTerm &&
        matchesaprovedFilter
      );
    });

  switch (sortMethod) {
    case "az":
      filteredRecipes.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      break;

    case "za":
      filteredRecipes.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      break;

    case "aproved":
      filteredRecipes.sort((a, b) => {
        return (
          (a.aproved === "false") -
          (b.aproved === "false")
        );
      });
      break;
  }

  displayRecipes(filteredRecipes);
}


// events
document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
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