let recipesData = [];
let perfumeTitle = [];

fetch("./code/assets/data.json")
  .then((response) => response.json())
  .then((data) => {
    recipesData = data;
    perfumeTitle = data.map((recipe) => recipe.title);
    displayRandomRecipes(recipesData);
    togglePerfumeTitle(perfumeTitle);
  })
  .catch((error) => console.error("Error fetching data:", error));

function togglePerfumeTitle(names) {
  const perfumeNameElement = document.getElementById("perfumeName");
  let currentIndex = 0;

  setInterval(() => {
    perfumeNameElement.classList.add("fade-out");

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % names.length;
      perfumeNameElement.textContent = names[currentIndex];
      perfumeNameElement.classList.remove("fade-out");
      perfumeNameElement.classList.add("fade-in");
    }, 500);

    setTimeout(() => {
      perfumeNameElement.classList.remove("fade-in");
    }, 1000);
  }, 3000);
}
function GotoRecipe(recipeid){
  sessionStorage.recipeID = recipeid
  console.log(recipeid);
}
function displayRandomRecipes(recipes) {
  const recipesContainer = document.querySelector(".homerecipes");
  recipesContainer.innerHTML = "";

const randomRecipes = [...recipes].sort(() => 0.5 - Math.random()).slice(0, 4);
  randomRecipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.id = "recipe";
    recipeCard.innerHTML = `
      <div class="recipeimg-container">
        <img src="${recipe.image}" alt="${recipe.title}" class="recipeimg" />
      </div>
      <h5>${recipe.title}</h5>
  
    
  <button>    
    <a href="../code/pages/recipe.html" class="nava" data-page="recipe" onClick="GotoRecipe('${recipe.id}')">Buy Now</a>
    </button>    `;
    recipesContainer.appendChild(recipeCard);
  });

  const showMoreButton = document.createElement("button");
  showMoreButton.innerHTML = `
    <a href="../code/pages/recipes.html" class="nava" data-page="recipes">SHOW MORE</a>
  `;
  recipesContainer.appendChild(showMoreButton);
}
