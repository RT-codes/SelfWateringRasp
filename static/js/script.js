// document loaded
$(document).ready(function () {
  $(".add-plant").click(function () {
    toggleAddCloseText();
    toggleSlideTray();
  });

  function toggleAddCloseText() {
    if ($("#add-plant-text").text() === "Add") {
      $("#add-plant-text").text("Close");
    } else {
      $("#add-plant-text").text("Add");
    }
  }

  document.getElementById("add-form").addEventListener("submit", sendAddPlantData);
});

function toggleSlideTray() {
  var tray = document.querySelector(".add-tray");
  var isAnimating = tray.classList.contains("animating");

  tray.style.animation = "none";

  if (!isAnimating) {
    tray.style.animation = "slideTray 0.5s forwards";
    tray.style.opacity = 1;
  } else {
    tray.style.opacity = 0; // Ensure element is hidden after the animation
    tray.style.animation = "none";
  }

  tray.classList.toggle("animating");
}

function sendAddPlantData() {
  const formElement = document.getElementById("add-form");
  console.log(formElement);
  const formData = new FormData(formElement);

  fetch("/add-plant", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // or .text() if the response is plain text
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((data) => {
      console.log(data);
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
}

function deletePlant(element) {
  const plantId = element.getAttribute("data-plant-id");
  fetch(`/delete-plant/${plantId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        element.closest(".plant-card").remove();
      }
    })
    .catch((error) => console.error("Error:", error));
}

function editPlant(element) {
  const plantCard = element.closest(".plant-card");
  const editOverlay = plantCard.querySelector(".card-edit-overlay"); // This should be the class of the form container

  editOverlay.classList.remove("hidden", "overlaySlideOut");
  editOverlay.classList.add("overlaySlideIn");
}

function closeEditPlant(element) {
  const plantId = element.getAttribute("data-plant-id");
  const plantCard = element.closest(".plant-card");
  const editOverlay = plantCard.querySelector(".card-edit-overlay");

  editOverlay.classList.remove("overlaySlideIn");
  editOverlay.classList.add("overlaySlideOut");

  setTimeout(() => {
    editOverlay.classList.add("hidden");
  }, 500);
}

function sendEditPlantData(element) {
  const plantId = element.getAttribute("data-plant-id");
  const formElement = element.closest(".edit-form");
  const formData = new FormData(formElement);

  fetch(`/update-plant/${plantId}`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // or .text() if the response is plain text
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((data) => {
      console.log(data);
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
}
