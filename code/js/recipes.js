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

    // Add class based on the aproved field
    if (recipe.aproved === "true") {
      recipeCard.classList.add("aproved");
    } else {
      recipeCard.classList.add("not-aproved");
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
  const aprovedFilter = document.getElementById("aprovedFilter").checked;

  let filteredRecipes = recipesData.filter((recipe) => {
    const matchesSearchTerm =
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm) ||
      recipe.price.toString().includes(searchTerm) ||
      recipe.type.toLowerCase().includes(searchTerm);

    const matchesaprovedFilter = aprovedFilter
      ? recipe.aproved === "true"
      : true;

    return matchesSearchTerm && matchesaprovedFilter;
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
    case "aproved":
      filteredRecipes.sort((a, b) => {
        return (a.aproved === "false") - (b.aproved === "false");
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
document.getElementById("aprovedFilter").addEventListener("change", filterAndSortRecipes);
