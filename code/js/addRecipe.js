(function () {
  function init() {
    const form = document.getElementById("addRecipeForm");
    if (!form) return; // ✅ prevent crash if not loaded

    const defaultImage = "https://placehold.jp/150x150.png";

    const ingredientsContainer = document.getElementById("ingredientsContainer");
    const methodContainer = document.getElementById("methodContainer");

    const addIngredientBtn = document.getElementById("addIngredientBtn");
    const addMethodBtn = document.getElementById("addMethodBtn");

    const imageFile = document.getElementById("imageFile");
    const imagePreview = document.getElementById("imagePreview");

    // ================= INGREDIENT =================
    addIngredientBtn.onclick = () => addIngredientRow();

    function addIngredientRow(name = "", qty = "") {
      const row = document.createElement("div");
      row.className = "ingredient-row";

      row.innerHTML = `
        <input class="ingredient-name" value="${name}" placeholder="Ingredient"/>
        <input class="ingredient-qty" value="${qty}" placeholder="Quantity"/>
        <button type="button">✖</button>
      `;

      row.querySelector("button").onclick = () => row.remove();
      ingredientsContainer.appendChild(row);
    }

    addIngredientRow();

    // ================= METHOD =================
    addMethodBtn.onclick = () => addMethodRow();

    function addMethodRow(step = "") {
      const row = document.createElement("div");
      row.className = "method-row";

      row.innerHTML = `
        <input class="method-step" value="${step}" placeholder="Step"/>
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
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("form-title").value.trim(); // ✅ FIXED ID

      let image = defaultImage;
      if (imageFile.files[0]) image = imagePreview.src;

      const approved = document.getElementById("approved").checked;

      const ingredients = [];
      document.querySelectorAll(".ingredient-row").forEach((row) => {
        const name = row.querySelector(".ingredient-name").value.trim();
        const quantity = row.querySelector(".ingredient-qty").value.trim();

        if (name) ingredients.push({ name, quantity });
      });

      const method = [];
      document.querySelectorAll(".method-row").forEach((row) => {
        const step = row.querySelector(".method-step").value.trim();
        if (step) method.push(step);
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

      fetch("/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      }).then(() => {
        alert("Recipe Added ✅");

        // ✅ RESET FORM CLEANLY
        form.reset();
        ingredientsContainer.innerHTML = "";
        methodContainer.innerHTML = "";

        addIngredientRow();
        addMethodRow();

        imagePreview.src = defaultImage;
      });
    });
  }

  init();
})();