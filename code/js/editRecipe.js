(function () {
  const form = document.getElementById("editRecipeForm");
  if (!form) return;

  let recipesData = [];
  const defaultImage = "https://placehold.jp/150x150.png";

  const ingredientsContainer = document.getElementById("ingredientsContainer");
  const methodContainer = document.getElementById("methodContainer");

  const imageFile = document.getElementById("imageFile");
  const imagePreview = document.getElementById("imagePreview");

  // LOAD DATA
  fetch("/recipes")
    .then((res) => res.json())
    .then((data) => (recipesData = data));

  // SEARCH
  document.getElementById("searchRecipeBtn").onclick = () => {
    const term = document.getElementById("editSearch").value.toLowerCase();
    const results = recipesData.filter((r) =>
      r.title.toLowerCase().includes(term),
    );
    display(results);
  };

  function display(recipes) {
    const box = document.getElementById("editSearchResults");
    box.innerHTML = "";

    recipes.forEach((r) => {
      const div = document.createElement("div");

      div.innerHTML = `
        <img src="${r.image || defaultImage}" width="80"/>
        <h5>${r.title}</h5>
        <button>Select</button>
      `;

      div.querySelector("button").onclick = () => loadRecipe(r.id);
      box.appendChild(div);
    });
  }

  function loadRecipe(id) {
    const r = recipesData.find((x) => x.id == id);
    if (!r) return;

    document.getElementById("editID").value = r.id;
    document.getElementById("form-title").value = r.title;
    document.getElementById("approved").checked = r.aproved === "true";

    imagePreview.src = r.image || defaultImage;

    loadIngredients(r.ingredients || []);
    loadMethods(r.method || []);
  }

  // INGREDIENT
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

  function loadIngredients(arr) {
    ingredientsContainer.innerHTML = "";
    arr.forEach((i) => addIngredientRow(i.name, i.quantity));
  }

  // METHOD
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

  function loadMethods(arr) {
    methodContainer.innerHTML = "";
    arr.forEach((s) => addMethodRow(s));
  }

  // IMAGE
  imageFile.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => (imagePreview.src = e.target.result);
    reader.readAsDataURL(file);
  });

  // SAVE
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const updated = {
      id: document.getElementById("editID").value,
      title: document.getElementById("form-title").value,
      image: imagePreview.src,
      aproved: document.getElementById("approved").checked ? "true" : "false",
      catigories: ["dessert"],
      ingredients: [],
      method: [],
    };

    document.querySelectorAll(".ingredient-row").forEach((row) => {
      updated.ingredients.push({
        name: row.querySelector(".ingredient-name").value,
        quantity: row.querySelector(".ingredient-qty").value,
      });
    });

    document.querySelectorAll(".method-row").forEach((row) => {
      const step = row.querySelector(".method-step").value.trim();
      if (step) updated.method.push(step);
    });

    fetch("/recipes/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).then(() => {
      alert("Updated ✅");

      // 🔥 RESET FORM
      form.reset();
      ingredientsContainer.innerHTML = "";
      methodContainer.innerHTML = "";
      imagePreview.src = defaultImage;
    });
  });
})();
