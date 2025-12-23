/**
 * Navigation handler for popup tabs
 */

/**
 * Initializes the navigation system
 */
export function initializeNavigation() {
  const navItems = document.querySelectorAll(".nav-list li");
  const containers = document.querySelectorAll(".container");

  let activeIndex = 0;
  navItems.forEach((item, index) => {
    if (item.classList.contains("active")) {
      activeIndex = index;
    }
  });

  containers.forEach((container) => container.classList.add("hidden"));
  if (containers[activeIndex]) {
    containers[activeIndex].classList.remove("hidden");
  }

  navItems.forEach((li) => {
    const img = li.querySelector("a > img");
    if (img) {
      img.classList.add("grey");
    }
  });

  const activeNavItem = navItems[activeIndex];
  if (activeNavItem) {
    const activeImg = activeNavItem.querySelector("a > img");
    if (activeImg) {
      activeImg.classList.remove("grey");
    }
  }

  navItems.forEach((item, index) => {
    item.addEventListener("click", function (e) {
      navItems.forEach((li) => li.classList.remove("active"));
      e.currentTarget.classList.add("active");

      navItems.forEach((li) => {
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
