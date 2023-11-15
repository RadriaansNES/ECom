document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("sidebar-toggle");
    const body = document.body;

    toggleButton.addEventListener("click", function () {
      if (sidebar.style.display === "none") {
        sidebar.style.display = "block";
        toggleButton.style.display = "none";
      } else {
        sidebar.style.display = "none";
        toggleButton.style.display = "block";
      }
    });

    toggleButton.addEventListener("mouseenter", function () {
      if (toggleButton.style.display === "block") {
        sidebar.style.display = "block";
        toggleButton.style.display = "none";
      }
    });

    sidebar.addEventListener("mouseleave", function () {
      if (sidebar.style.display === "block") {
        sidebar.style.display = "none";
        toggleButton.style.display = "block";
      }
    });

    body.addEventListener("scroll", function () {
      if (
        sidebar.style.display === "none" &&
        body.scrollTop >= sidebar.offsetTop
      ) {
        toggleButton.style.display = "none";
      } else {
        toggleButton.style.display = "block";
      }
    });
  });