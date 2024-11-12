// script.js

document.addEventListener("DOMContentLoaded", function() {
    const showMoreButton = document.getElementById("showMoreButton");
    const additionalContent = document.getElementById("additionalContent");
  
    showMoreButton.addEventListener("click", function() {
      if (additionalContent.style.display === "none") {
        additionalContent.style.display = "block";
        showMoreButton.textContent = "Show Less";
      } else {
        additionalContent.style.display = "none";
        showMoreButton.textContent = "Show More";
      }
    });
  });
  