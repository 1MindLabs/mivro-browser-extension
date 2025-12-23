/**
 * Search page component
 * Handles product search using OpenFoodFacts API and detailed product view
 */
import { apiFetch } from "../../shared/api/client.js";
import { ENDPOINTS } from "../../shared/api/endpoints.js";
import { getAuth } from "../../shared/auth-storage.js";

const OPENFOODFACTS_API = {
  BASE_URL: "https://world.openfoodfacts.org",
  USER_AGENT: "Mivro/1.0",
};

/**
 * Initializes the search page
 * Sets up event listeners for search input and button
 */
export function initializeSearchPage() {
  const searchContainer = document.querySelector(".search");
  const searchInput = searchContainer?.querySelector("textarea");
  const sendButton = searchContainer?.querySelector(".icon-div");

  if (!searchContainer || !searchInput || !sendButton) {
    return;
  }

  sendButton.addEventListener("click", () => {
    handleSearch(searchInput, searchContainer);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSearch(searchInput, searchContainer);
    }
  });
}

/**
 * Handles search query submission
 * Fetches products from OpenFoodFacts API and displays results
 * @param {HTMLTextAreaElement} searchInput - Search input element
 * @param {HTMLElement} searchContainer - Search container element
 */
async function handleSearch(searchInput, searchContainer) {
  const query = searchInput.value.trim();

  if (!query) {
    return;
  }

  clearResults(searchContainer);

  const spinner = document.querySelector(".search .spinner");
  spinner?.classList.remove("hidden");

  try {
    const url = new URL(`${OPENFOODFACTS_API.BASE_URL}/cgi/search.pl`);
    url.searchParams.append("search_terms", query);
    url.searchParams.append("page", "1");
    url.searchParams.append("page_size", "20");
    url.searchParams.append("json", "true");
    url.searchParams.append(
      "fields",
      "code,product_name,brands,image_url,image_front_url,image_front_small_url,selected_images",
    );

    const response = await fetch(url, {
      headers: {
        "User-Agent": OPENFOODFACTS_API.USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    // console.log('OpenFoodFacts API Response:', data);
    spinner?.classList.add("hidden");

    if (!data.products || data.products.length === 0) {
      showError(
        searchContainer,
        "No products found. Try a different search term.",
      );
      return;
    }

    searchInput.value = "";
    searchInput.rows = 1;
    searchInput.style.overflowY = "hidden";

    displayResults(searchContainer, data.products);
  } catch (error) {
    console.error("OpenFoodFacts API Error:", error);
    spinner?.classList.add("hidden");
    showError(searchContainer, "An error occurred. Please try again.");
  }
}

/**
 * Clears all existing results and error messages from container
 * @param {HTMLElement} container - Container element to clear
 */
function clearResults(container) {
  const existingResults = container.querySelector(".search-results");
  if (existingResults) {
    existingResults.remove();
  }

  const existingDetail = container.querySelector(".search-detail-view");
  if (existingDetail) {
    existingDetail.remove();
  }

  const existingError = container.querySelector(".search-error");
  if (existingError) {
    existingError.remove();
  }
}

/**
 * Displays error message to user
 * @param {HTMLElement} container - Container element
 * @param {string} message - Error message to display
 */
function showError(container, message) {
  const errorDiv = document.createElement("div");
  errorDiv.classList.add("search-error");
  errorDiv.textContent = message;

  const searchResults = container.querySelector(".search-results");
  if (searchResults) {
    container.insertBefore(errorDiv, searchResults);
  } else {
    container.appendChild(errorDiv);
  }
}

/**
 * Displays search results as a grid of product cards
 * @param {HTMLElement} container - Container element
 * @param {Array} products - Array of product objects from API
 */
function displayResults(container, products) {
  const resultsContainer = document.createElement("div");
  resultsContainer.classList.add("search-results");

  products.forEach((product) => {
    const productCard = createProductCard(product);
    resultsContainer.appendChild(productCard);
  });

  container.appendChild(resultsContainer);
}

/**
 * Creates a clickable product card element
 * @param {Object} product - Product data from API
 * @returns {HTMLDivElement} Product card element
 */
function createProductCard(product) {
  const card = document.createElement("div");
  card.classList.add("search-product-card");
  card.style.cursor = "pointer";

  card.addEventListener("click", async () => {
    await handleProductClick(product);
  });

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("search-product-image-container");

  const image = document.createElement("img");
  image.src = getOpenFoodFactsImageUrl(product);
  image.classList.add("search-product-image");
  image.onerror = function () {
    image.src = chrome.runtime.getURL("assets/icons/food/no-image.png");
  };
  imageContainer.appendChild(image);
  card.appendChild(imageContainer);

  const infoContainer = document.createElement("div");
  infoContainer.classList.add("search-product-info");

  const productName = document.createElement("div");
  productName.classList.add("search-product-name");
  productName.textContent = product.product_name || "Unknown Product";
  infoContainer.appendChild(productName);

  if (product.brands) {
    const brandName = document.createElement("div");
    brandName.classList.add("search-product-brand");
    brandName.textContent = product.brands;
    infoContainer.appendChild(brandName);
  }

  card.appendChild(infoContainer);

  return card;
}

/**
 * Handles product card click event
 * Fetches detailed product data and displays detail view
 * @param {Object} product - Product data from search results
 */
async function handleProductClick(product) {
  const searchContainer = document.querySelector(".search");
  const searchResults = searchContainer.querySelector(".search-results");
  const spinner = document.querySelector(".search .spinner");

  if (searchResults) {
    searchResults.style.opacity = "0";
    setTimeout(() => searchResults.classList.add("hidden"), 300);
  }

  spinner?.classList.remove("hidden");

  try {
    const auth = await getAuth();
    const queryParams = new URLSearchParams({
      search_query: product.product_name || product.code,
      page: "1",
      page_size: "1",
    });

    const response = await apiFetch(`${ENDPOINTS.SEARCH_TEXT}?${queryParams}`, {
      method: "GET",
      auth,
    });

    const data = await response.json();
    // console.log('Backend API Response:', data);
    spinner?.classList.add("hidden");

    if (data.error || !data.products || data.products.length === 0) {
      const searchInputContainer =
        searchContainer.querySelector(".search-container");
      if (searchInputContainer) {
        searchInputContainer.classList.remove("hidden");
        searchInputContainer.style.opacity = "1";
      }
      if (searchResults) {
        searchResults.classList.remove("hidden");
        searchResults.style.opacity = "1";
      }
      showError(searchContainer, "Product details not available");
      return;
    }

    displayProductDetail(searchContainer, data.products[0]);
  } catch (error) {
    console.error("Backend API Error:", error);
    spinner?.classList.add("hidden");
    const searchInputContainer =
      searchContainer.querySelector(".search-container");
    if (searchInputContainer) {
      searchInputContainer.classList.remove("hidden");
      searchInputContainer.style.opacity = "1";
    }
    if (searchResults) {
      searchResults.classList.remove("hidden");
      searchResults.style.opacity = "1";
    }
    showError(searchContainer, "Failed to load product details");
  }
}

/**
 * Displays detailed product information view
 * @param {HTMLElement} container - Container element
 * @param {Object} productData - Complete product data from API
 */
function displayProductDetail(container, productData) {
  const searchInputContainer = container.querySelector(".search-container");
  if (searchInputContainer) {
    searchInputContainer.style.opacity = "0";
    setTimeout(() => searchInputContainer.classList.add("hidden"), 300);
  }

  const detailView = document.createElement("div");
  detailView.classList.add("search-detail-view");

  const topNav = document.createElement("div");
  topNav.classList.add("search-detail-nav");

  const backButton = document.createElement("button");
  backButton.classList.add("search-nav-back");
  backButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
    <span>Back</span>
  `;
  backButton.addEventListener("click", () => {
    detailView.style.opacity = "0";
    setTimeout(() => {
      detailView.remove();

      const searchInputContainer = container.querySelector(".search-container");
      if (searchInputContainer) {
        searchInputContainer.classList.remove("hidden");
        setTimeout(() => {
          searchInputContainer.style.opacity = "1";
        }, 10);
      }

      const searchResults = container.querySelector(".search-results");
      if (searchResults) {
        searchResults.classList.remove("hidden");
        setTimeout(() => {
          searchResults.style.opacity = "1";
        }, 10);
      }
    }, 300);
  });
  topNav.appendChild(backButton);

  const navTitle = document.createElement("div");
  navTitle.classList.add("search-nav-title");
  navTitle.textContent = "Product Details";
  topNav.appendChild(navTitle);

  detailView.appendChild(topNav);

  const productHeader = createProductHeader(productData);
  detailView.appendChild(productHeader);

  if (productData.nutriments?.negative_nutrient?.length > 0) {
    const negativeSection = createNegativeNutrientsSection(
      productData.nutriments.negative_nutrient,
    );
    detailView.appendChild(negativeSection);
  }

  if (productData.nutriments?.positive_nutrient?.length > 0) {
    const positiveSection = createPositiveNutrientsSection(
      productData.nutriments.positive_nutrient,
    );
    detailView.appendChild(positiveSection);
  }

  if (productData.ingredients?.length > 0) {
    const ingredientsSection = createIngredientsSection(
      productData.ingredients,
    );
    detailView.appendChild(ingredientsSection);
  }

  if (productData.nova_group && productData.nova_group_name) {
    const novaGroupSection = createNovaGroupSection(productData);
    detailView.appendChild(novaGroupSection);
  }

  if (
    productData.health_risk &&
    productData.health_risk.ingredient_warnings?.length > 0
  ) {
    const healthRiskSection = createHealthRiskSection(productData.health_risk);
    detailView.appendChild(healthRiskSection);
  }

  detailView.style.opacity = "0";
  container.appendChild(detailView);
  setTimeout(() => {
    detailView.style.opacity = "1";
  }, 10);
}

/**
 * Creates product header with image, name, brand, and score
 * @param {Object} productData - Product data
 * @returns {HTMLDivElement} Product header element
 */
function createProductHeader(productData) {
  const header = document.createElement("div");
  header.classList.add("search-product-header");

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("search-detail-image-container");
  const image = document.createElement("img");
  image.src = getProductImageUrl(productData);
  image.classList.add("search-detail-image");
  image.onerror = function () {
    image.src = chrome.runtime.getURL("assets/icons/food/no-image.png");
  };
  imageContainer.appendChild(image);
  header.appendChild(imageContainer);

  const info = document.createElement("div");
  info.classList.add("search-detail-info");

  const productName = document.createElement("h3");
  productName.classList.add("search-detail-name");
  productName.textContent = productData.product_name || "Unknown Product";
  info.appendChild(productName);

  if (productData.brands) {
    const brandName = document.createElement("div");
    brandName.classList.add("search-detail-brand");
    brandName.textContent = productData.brands;
    info.appendChild(brandName);
  }

  if (
    productData.nutriscore_score !== undefined &&
    productData.nutriscore_score !== null
  ) {
    const scoreSection = createScoreDisplay(productData);
    info.appendChild(scoreSection);
  }

  header.appendChild(info);

  return header;
}

/**
 * Creates score display section using unified primary_score
 * @param {Object} productData - Product data with primary_score
 * @returns {HTMLDivElement} Score display element
 */
function createScoreDisplay(productData) {
  const scoreContainer = document.createElement("div");
  scoreContainer.classList.add("search-score-display");
  const primaryScore = productData.primary_score;

  const scoreInfo = document.createElement("div");
  scoreInfo.classList.add("search-detail-score-info");

  const score = document.createElement("div");
  score.classList.add("search-detail-score");
  score.textContent =
    primaryScore?.score !== undefined && primaryScore?.score !== null
      ? `${primaryScore.score}/100`
      : "N/A";
  scoreInfo.appendChild(score);

  if (primaryScore?.assessment) {
    const assessment = document.createElement("div");
    assessment.classList.add("search-detail-assessment");
    assessment.textContent = primaryScore.assessment;
    scoreInfo.appendChild(assessment);
  }

  scoreContainer.appendChild(scoreInfo);

  if (primaryScore?.grade) {
    const grade = document.createElement("div");
    grade.classList.add("search-detail-grade");
    grade.textContent = primaryScore.grade;
    grade.style.color = primaryScore.grade_color || "#757575";
    scoreContainer.appendChild(grade);
  }

  return scoreContainer;
}

/**
 * Creates positive nutrients section
 * @param {Array} positiveNutrients - Array of positive nutrient objects
 * @returns {HTMLDivElement} Positive nutrients section element
 */
function createPositiveNutrientsSection(positiveNutrients) {
  const section = document.createElement("div");
  section.classList.add("search-section");

  const title = document.createElement("h4");
  title.classList.add("search-section-title");
  title.textContent = "POSITIVES";
  section.appendChild(title);

  positiveNutrients.forEach((nutrient, index) => {
    const item = createNutrientItem(nutrient);
    if (index >= 3) {
      item.classList.add("hide-nutrient");
    }
    section.appendChild(item);
  });

  if (positiveNutrients.length > 3) {
    const showMoreButton = createShowMoreButton(
      section,
      ".search-nutrient-item",
    );
    section.appendChild(showMoreButton);
  }

  return section;
}

/**
 * Creates negative nutrients section
 * @param {Array} negativeNutrients - Array of negative nutrient objects
 * @returns {HTMLDivElement} Negative nutrients section element
 */
function createNegativeNutrientsSection(negativeNutrients) {
  const section = document.createElement("div");
  section.classList.add("search-section");

  const title = document.createElement("h4");
  title.classList.add("search-section-title");
  title.textContent = "NEGATIVES";
  section.appendChild(title);

  negativeNutrients.forEach((nutrient, index) => {
    const item = createNutrientItem(nutrient);
    if (index >= 3) {
      item.classList.add("hide-nutrient");
    }
    section.appendChild(item);
  });

  if (negativeNutrients.length > 3) {
    const showMoreButton = createShowMoreButton(
      section,
      ".search-nutrient-item",
    );
    section.appendChild(showMoreButton);
  }

  return section;
}

/**
 * Creates individual nutrient item element
 * @param {Object} nutrient - Nutrient data with name, quantity, icon, text, color
 * @returns {HTMLDivElement} Nutrient item element
 */
function createNutrientItem(nutrient) {
  const item = document.createElement("div");
  item.classList.add("search-nutrient-item");

  const leftDiv = document.createElement("div");
  leftDiv.classList.add("search-nutrient-left");
  const icon = document.createElement("img");
  icon.src = chrome.runtime.getURL(`assets/icons/food/${nutrient.icon}.png`);
  icon.classList.add("search-nutrient-icon");
  icon.onerror = function () {
    icon.src = chrome.runtime.getURL("assets/icons/food/no-image.png");
  };
  leftDiv.appendChild(icon);
  item.appendChild(leftDiv);

  const centerDiv = document.createElement("div");
  centerDiv.classList.add("search-nutrient-center");
  const name = document.createElement("div");
  name.classList.add("search-nutrient-name");
  name.textContent = nutrient.name || "Unknown";
  centerDiv.appendChild(name);

  if (nutrient.text) {
    const text = document.createElement("div");
    text.classList.add("search-nutrient-text");
    text.textContent = nutrient.text;
    centerDiv.appendChild(text);
  }
  item.appendChild(centerDiv);

  const rightDiv = document.createElement("div");
  rightDiv.classList.add("search-nutrient-right");
  const quantity = document.createElement("div");
  quantity.classList.add("search-nutrient-quantity");
  quantity.textContent = nutrient.quantity || "N/A";
  rightDiv.appendChild(quantity);

  const colorDiv = document.createElement("div");
  colorDiv.classList.add("search-nutrient-color");
  colorDiv.style.backgroundColor = nutrient.color || "#757575";
  rightDiv.appendChild(colorDiv);
  item.appendChild(rightDiv);

  return item;
}

/**
 * Creates ingredients section with ingredient items
 * @param {Array} ingredients - Array of ingredient objects
 * @returns {HTMLDivElement} Ingredients section element
 */
function createIngredientsSection(ingredients) {
  const section = document.createElement("div");
  section.classList.add("search-section");

  const title = document.createElement("h4");
  title.classList.add("search-section-title");
  title.textContent = "INGREDIENTS";
  section.appendChild(title);

  ingredients.forEach((ingredient, index) => {
    const item = createIngredientItem(ingredient);
    if (index >= 3) {
      item.classList.add("hide-ingredient");
    }
    section.appendChild(item);
  });

  if (ingredients.length > 3) {
    const showMoreButton = createShowMoreButton(
      section,
      ".search-ingredient-item",
    );
    section.appendChild(showMoreButton);
  }

  return section;
}

/**
 * Creates individual ingredient item
 * @param {Object} ingredient - Ingredient data with name, icon, percentage
 * @returns {HTMLDivElement} Ingredient item element
 */
function createIngredientItem(ingredient) {
  const item = document.createElement("div");
  item.classList.add("search-ingredient-item");

  const iconDiv = document.createElement("div");
  iconDiv.classList.add("search-ingredient-icon-div");
  const icon = document.createElement("img");
  icon.src = chrome.runtime.getURL(`assets/icons/food/${ingredient.icon}.png`);
  icon.classList.add("search-ingredient-icon");
  icon.onerror = function () {
    icon.src = chrome.runtime.getURL("assets/icons/food/no-image.png");
  };
  iconDiv.appendChild(icon);
  item.appendChild(iconDiv);

  const name = document.createElement("div");
  name.classList.add("search-ingredient-name");
  name.textContent = ingredient.name || "Unknown Ingredient";
  item.appendChild(name);

  const percentage = document.createElement("div");
  percentage.classList.add("search-ingredient-percentage");
  percentage.textContent = ingredient.percentage || "";
  item.appendChild(percentage);

  return item;
}

/**
 * Creates Nova Group section with classification
 * @param {Object} productData - Product data with nova_group fields
 * @returns {HTMLDivElement} Nova Group section element
 */
function createNovaGroupSection(productData) {
  const section = document.createElement("div");
  section.classList.add("search-section");

  const title = document.createElement("h4");
  title.classList.add("search-section-title");
  title.textContent = "Nova Group";
  section.appendChild(title);

  const novaContent = document.createElement("div");
  novaContent.classList.add("search-nova-content");

  const novaIcon = document.createElement("img");
  novaIcon.src = chrome.runtime.getURL(
    `assets/icons/food/${productData.nova_group}.png`,
  );
  novaIcon.classList.add("search-nova-icon");
  novaIcon.onerror = function () {
    this.style.display = "none";
  };
  novaContent.appendChild(novaIcon);

  const novaText = document.createElement("div");
  novaText.classList.add("search-nova-text");
  novaText.textContent = productData.nova_group_name;
  novaContent.appendChild(novaText);

  section.appendChild(novaContent);

  return section;
}

/**
 * Creates health risk section with ingredient warnings
 * @param {Object} healthRisk - Health risk data with warnings array
 * @returns {HTMLDivElement} Health risk section element
 */
function createHealthRiskSection(healthRisk) {
  const section = document.createElement("div");
  section.classList.add("search-section");

  const title = document.createElement("h4");
  title.classList.add("search-section-title");
  title.textContent = "HEALTH RISKS";
  section.appendChild(title);

  healthRisk.ingredient_warnings.forEach((warning, index) => {
    const item = document.createElement("div");
    item.classList.add("search-health-item");

    let warningData;
    if (typeof warning === "string") {
      try {
        warningData = JSON.parse(warning);
      } catch {
        warningData = { issue: warning, reasoning: "" };
      }
    } else if (warning && typeof warning === "object") {
      warningData = warning;
    } else {
      warningData = { issue: String(warning), reasoning: "" };
    }

    const issueDiv = document.createElement("div");
    issueDiv.classList.add("search-health-issue");
    issueDiv.textContent = warningData.issue || "Health Concern";
    item.appendChild(issueDiv);

    if (warningData.reasoning) {
      const reasoningDiv = document.createElement("div");
      reasoningDiv.classList.add("search-health-reasoning");
      reasoningDiv.textContent = warningData.reasoning;
      item.appendChild(reasoningDiv);
    }

    if (index >= 1) {
      item.classList.add("hide-health");
    }

    section.appendChild(item);
  });

  if (healthRisk.ingredient_warnings.length > 1) {
    const showMoreButton = createShowMoreButton(
      section,
      ".search-health-item",
      1,
    );
    section.appendChild(showMoreButton);
  }

  return section;
}

/**
 * Creates a show more/less toggle button
 * @param {HTMLElement} container - Parent container
 * @param {string} itemSelector - CSS selector for items to toggle
 * @param {number} collapsedCount - Number of items to show when collapsed
 * @returns {HTMLDivElement} Show more button element
 */
function createShowMoreButton(container, itemSelector, collapsedCount = 3) {
  const showMoreDiv = document.createElement("div");
  showMoreDiv.classList.add("search-show-more");
  showMoreDiv.textContent = "Show More";

  let isExpanded = false;

  showMoreDiv.addEventListener("click", () => {
    const items = container.querySelectorAll(itemSelector);

    if (!isExpanded) {
      items.forEach((item) => {
        item.classList.remove(
          "hide-nutrient",
          "hide-ingredient",
          "hide-health",
        );
      });
      showMoreDiv.textContent = "Show Less";
    } else {
      items.forEach((item, index) => {
        if (index >= collapsedCount) {
          if (itemSelector.includes("nutrient")) {
            item.classList.add("hide-nutrient");
          } else if (itemSelector.includes("ingredient")) {
            item.classList.add("hide-ingredient");
          } else if (itemSelector.includes("health")) {
            item.classList.add("hide-health");
          }
        }
      });
      showMoreDiv.textContent = "Show More";
    }

    isExpanded = !isExpanded;
  });

  return showMoreDiv;
}

/**
 * Extracts image URL from OpenFoodFacts API direct response (for search results)
 * @param {Object} product - Product data from OpenFoodFacts API
 * @returns {string} Image URL or fallback to no-image icon
 */
function getOpenFoodFactsImageUrl(product) {
  if (!product) {
    return chrome.runtime.getURL("assets/icons/food/no-image.png");
  }

  if (product.image_front_url) {
    return product.image_front_url;
  }

  if (product.image_url) {
    return product.image_url;
  }

  if (product.selected_images?.front?.display) {
    const displayImages = product.selected_images.front.display;
    const imageUrl =
      displayImages.en || displayImages[Object.keys(displayImages)[0]];
    if (imageUrl) {
      return imageUrl;
    }
  }

  return chrome.runtime.getURL("assets/icons/food/no-image.png");
}

/**
 * Extracts image URL from product data
 * @param {Object} product - Product data from API with image fields
 * @returns {string} Image URL or fallback to no-image icon
 */
function getProductImageUrl(product) {
  if (!product || !product.selected_images) {
    return chrome.runtime.getURL("assets/icons/food/no-image.png");
  }

  const images = product.selected_images;
  const imageUrl = images.en || images[Object.keys(images)[0]];

  return imageUrl || chrome.runtime.getURL("assets/icons/food/no-image.png");
}
