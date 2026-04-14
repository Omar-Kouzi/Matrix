(function () {

  const defaultImage = "https://placehold.jp/150x150.png";

  const ingredientsContainer = document.getElementById("ingredientsContainer");
  const methodContainer = document.getElementById("methodContainer");

  const imageFile = document.getElementById("imageFile");
  const imagePreview = document.getElementById("imagePreview");

  // ================= INGREDIENT =================
  document.getElementById("emailIngredientBtn").onclick = () => {
    addIngredientRow();
  };

  function addIngredientRow(name = "", qty = "") {
    const row = document.createElement("div");

    row.className = "ingredient-row";

    row.innerHTML = `
      <input class="ingredient-name" placeholder="Ingredient" value="${name}" />
      <input class="ingredient-qty" placeholder="Quantity" value="${qty}" />
      <button type="button">✖</button>
    `;

    row.querySelector("button").onclick = () => row.remove();

    ingredientsContainer.appendChild(row);
  }

  addIngredientRow();

  // ================= METHOD =================
  document.getElementById("emailMethodBtn").onclick = () => {
    addMethodRow();
  };

  function addMethodRow(step = "") {
    const row = document.createElement("div");

    row.className = "method-row";

    row.innerHTML = `
      <input class="method-step" placeholder="Step" value="${step}" />
      <button type="button">✖</button>
    `;

    row.querySelector("button").onclick = () => row.remove();

    methodContainer.appendChild(row);
  }

  addMethodRow();

  // ================= IMAGE =================
  imageFile.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => (imagePreview.src = e.target.result);
      reader.readAsDataURL(file);
    }
  });

  // ================= SUBMIT =================
  document.getElementById("emailRecipeForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("recipeID").value.trim();
    const title = document.getElementById("form-title").value.trim();
    const approved = document.getElementById("approved").checked;

    let image = defaultImage;
    if (imageFile.files[0]) image = imagePreview.src;

    // INGREDIENTS
    const ingredients = [];
    document.querySelectorAll(".ingredient-row").forEach((row) => {
      const name = row.querySelector(".ingredient-name").value.trim();
      const qty = row.querySelector(".ingredient-qty").value.trim();

      if (name) {
        ingredients.push({ name, quantity: qty });
      }
    });

    // METHOD
    const method = [];
    document.querySelectorAll(".method-row").forEach((row) => {
      const step = row.querySelector(".method-step").value.trim();
      if (step) method.push(step);
    });

    const recipeJSON = {
      id: id || Date.now().toString(),
      title,
      image,
      ingredients,
      method,
      aproved: approved ? "true" : "false",
      catigories: ["dessert"],
    };

    // ✅ SEND EMAIL
    emailjs.send("service_nkclw4q", "template_5oyyll8", {
      message: JSON.stringify(recipeJSON, null, 2),
    })
    .then(() => {
      alert("Recipe sent ✅");
    })
    .catch((err) => {
      console.error(err);
      alert("Failed ❌");
    });

  });

})();