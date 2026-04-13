let recipesData = [];
const defaultImage = "https://placehold.jp/150x150.png";

const ingredientsContainer = document.getElementById("ingredientsContainer");

const addIngredientBtn = document.getElementById("addIngredientBtn");
const methodContainer = document.getElementById("methodContainer");

const addMethodBtn = document.getElementById("addMethodBtn");

const imageFile = document.getElementById("imageFile");

const imagePreview = document.getElementById("imagePreview");

// ================= ADD INGREDIENT =================

addIngredientBtn.addEventListener("click", addIngredientRow);

function addIngredientRow(name = "", qty = "") {
  const row = document.createElement("div");
  row.className = "ingredient-row";

  row.innerHTML = `
    <input type="text" class="ingredient-name" placeholder="Ingredient" value="${name}" />
    <input type="text" class="ingredient-qty" placeholder="Quantity" value="${qty}" />
    <button type="button" class="removeIngredient">✖</button>
  `;

  row.querySelector(".removeIngredient").addEventListener("click", () => {
    row.remove();
  });

  ingredientsContainer.appendChild(row);
}

// first row
addIngredientRow();
// ================= ADD METHOD =================

addMethodBtn.addEventListener("click", addMethodRow);

function addMethodRow(step = "") {
  const row = document.createElement("div");
  row.className = "method-row";

  row.innerHTML = `
    <input type="text" class="method-step" placeholder="Method" value="${step}" />
    <button type="button" class="removeMethod">✖</button>
  `;

  row.querySelector(".removeMethod").addEventListener("click", () => {
    row.remove();
  });

  methodContainer.appendChild(row);
}

// first row
addMethodRow();

// ================= IMAGE PREVIEW =================

imageFile.addEventListener("change", function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      imagePreview.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
});

// ================= SUBMIT =================

document
  .getElementById("addRecipeForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;

    let image = defaultImage;

    if (imageFile.files[0]) {
      image = imagePreview.src;
    }

    const approved = document.getElementById("approved").checked;

    const ingredients = [];

    document.querySelectorAll(".ingredient-row").forEach((row) => {
      const name = row.querySelector(".ingredient-name").value;

      const quantity = row.querySelector(".ingredient-qty").value;

      if (name.trim() !== "") {
        ingredients.push({ name, quantity });
      }
    });
    console.log(ingredients);
    const method = [];

    document.querySelectorAll(".method-row").forEach((row) => {
      const step = row.querySelector(".method-step").value;

      if (step.trim() !== "") {
        method.push({ step });
      }
    });
    const newRecipe = {
      id: Date.now().toString(),
      title,
      image,
      ingredients,
      method,
      aproved: approved ? "true" : "false",
      catigories: ["dessert"],
    };

    // SEND TO SERVER
    fetch("/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecipe),
    }).then(() => {
      alert("Recipe Added ✅");

      document.getElementById("addRecipeForm").reset();

      ingredientsContainer.innerHTML = "";
      methodContainerContainer.innerHTML = "";

      addIngredientRow();
      addMethodRow();

      imagePreview.src = defaultImage;
    });
  });
