let recipesData = [];

fetch("./code/assets/data.json")
  .then((response) => response.json())
  .then((data) => {
    recipesData = data;
    displayRecipes(data);
  })
  .catch((error) => console.error("Error fetching data:", error));

function GotoRecipe(recipeid){
  sessionStorage.recipeID = recipeid
  console.log(recipeid);
}

function displayRecipes(recipes) {
  const recipesContainer = document.getElementById("recipesContainer");
  recipesContainer.innerHTML = "";
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.id = "recipe";

    // Add class based on the obtained field
    if (recipe.obtained === "true") {
      recipeCard.classList.add("obtained");
    } else {
      recipeCard.classList.add("not-obtained");
    }

    recipeCard.innerHTML = `
    <div class="recipeimg-container">
      <img src="${recipe.image}" alt="img" class="recipeimg" />
    </div>
    <h5>${recipe.title}</h5>
  
    <button>    
    <a href="../pages/recipe.html" class="nava" data-page="recipe" onClick="GotoRecipe('${recipe.id}')">Buy Now</a>
    </button>
  `;
  
    recipesContainer.appendChild(recipeCard);
  });
}

function filterAndSortRecipes() {
  const searchTerm = document.getElementById("filterInput").value.toLowerCase();
  const sortMethod = document.getElementById("sortSelect").value;
  const obtainedFilter = document.getElementById("obtainedFilter").checked;

  let filtered = recipeData.filter((recipe) => {
    const matchesSearchTerm =
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm) ||
      recipe.price.toString().includes(searchTerm) ||
      recipe.type.toLowerCase().includes(searchTerm);

    const matchesObtainedFilter = obtainedFilter
      ? recipe.obtained === "true"
      : true;

    return matchesSearchTerm && matchesObtainedFilter;
  });

  switch (sortMethod) {
    case "az":
      filteredRecipes.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "za":
      filteredRecipes.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "priceHighLow":
      filteredRecipes.sort((a, b) => b.price - a.price);
      break;
    case "priceLowHigh":
      filteredRecipes.sort((a, b) => a.price - b.price);
      break;
    case "obtained":
      filteredRecipes.sort((a, b) => {
        return (a.obtained === "false") - (b.obtained === "false");
      });
      break;
  }

  displayRecipes(filteredRecipes);
}

document.getElementById("searchForm").addEventListener("submit", function (event) {
  event.preventDefault();
  filterAndSortRecipes();
});

document.getElementById("sortSelect").addEventListener("change", filterAndSortRecipes);
document.getElementById("obtainedFilter").addEventListener("change", filterAndSortRecipes);
