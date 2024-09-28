export function initializeNavigation() {
  const list = document.querySelectorAll(".nav-list li");
  const containers = document.querySelectorAll(".container");

  list.forEach((item, index) => {
    item.addEventListener("click", function (e) {
      list.forEach((li) => li.classList.remove("active"));
      e.currentTarget.classList.add("active");

      list.forEach((li) => {
        const img = li.querySelector("a > img");
        if (img) {
          img.classList.add("grey");
        }
      });

      const clickedImg = e.currentTarget.querySelector("a > img");
      if (clickedImg) {
        clickedImg.classList.remove("grey");
      }

      containers.forEach((container) => container.classList.add("hidden"));
      containers[index].classList.remove("hidden");
    });
  });
}
