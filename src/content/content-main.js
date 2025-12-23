/**
 * Bundled Content Script - Mivro Extension
 * Single file bundle with all dependencies inline (no ES6 modules)
 * All code wrapped in IIFE to avoid global namespace pollution
 */

(function () {
  "use strict";

  // ============================================================================
  // CONSTANTS
  // ============================================================================

  // Icon paths are handled by the background script

  const UI_CONFIG = {
    MAX_TEXTAREA_ROWS: 3,
    TEXTAREA_LINE_HEIGHT: 20,
    COLLAPSED_ITEM_COUNT: 3,
    HEALTH_COLLAPSED_COUNT: 1,
  };

  const MESSAGES = {
    CHAT_HEADER: [
      "🍽️ Ready to whip up something delicious? Ask Savora!",
      "👩‍🍳 What's cooking today? Let Savora inspire you!",
      "🧑‍🍳 Need recipe magic? Savora has your back!",
      "🌟 Discover your next favorite meal with Savora!",
      "🍲 Craving something special? Ask Savora for a recipe!",
      "🥗 Savora serves up recipes for every craving!",
      "🍕 Hungry for ideas? Let Savora guide you to the perfect dish!",
      "🥘 Unlock a world of flavors with Savora's recipes!",
      "🍔 What's on the menu tonight? Savora knows!",
      "🍝 Let's find your perfect recipe, Savora style!",
      "🥑 Feeling adventurous? Ask Savora for a unique recipe!",
      "🍳 From breakfast to dinner, Savora's got it covered!",
      "🍰 Sweet tooth calling? Savora has dessert ideas too!",
      "🍛 Spice up your day with Savora's top recipes!",
      "🌮 Craving something quick? Let Savora help you out!",
    ],
    NO_DATA: "No data available.",
    PRODUCT_NOT_FOUND: "No product name found.",
    ERROR_RESPONSE: "Sorry, I am unable to respond at the moment.",
  };

  // ============================================================================
  // SHARED UTILITIES
  // ============================================================================

  /**
   * Capitalizes the first letter of a string
   * @param {string} str - The string to capitalize
   * @returns {string} Capitalized string
   */
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Extracts meaningful search keywords from product name
   * Removes common words, weights, and keeps brand + product type
   * @param {string} productName - Full product name
   * @returns {string} Optimized search query
   */
  function extractSearchKeywords(productName) {
    // Remove common filler words and measurements
    const stopWords = [
      "the",
      "and",
      "or",
      "with",
      "pack",
      "pouch",
      "bottle",
      "can",
      "jar",
      "box",
      "packet",
      "combo",
      "value",
      "family",
      "super",
      "fresh",
      "premium",
      "special",
      "best",
      "quality",
      "pure",
      "organic",
      "natural",
      "original",
      "classic",
      "new",
    ];

    // Remove weight/volume patterns (e.g., 200g, 1kg, 500ml, 2l)
    let cleaned = productName.replace(
      /\d+\.?\d*\s*(g|kg|ml|l|gm|gms|litre|liter|gram|grams)\b/gi,
      "",
    );

    // Remove parentheses content (often contains weight/pack info)
    cleaned = cleaned.replace(/\([^)]*\)/g, "");

    // Clean special characters but keep hyphens and ampersands
    cleaned = cleaned.replace(/[^a-zA-Z0-9\s&-]/g, " ");

    // Split into words and filter
    const words = cleaned
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.includes(word));

    // Take first 3-4 meaningful words (usually brand + product type)
    const searchQuery = words.slice(0, 4).join(" ").trim();

    return searchQuery || productName.toLowerCase().slice(0, 30);
  }

  // ============================================================================
  // SCRAPERS
  // ============================================================================

  /**
   * Zepto product scraper
   * Extracts product name from h1 element
   */
  function scrapeZepto() {
    return {
      name:
        document.querySelector("h1")?.innerText.trim() ||
        "Product name not found",
    };
  }

  /**
   * Blinkit product scraper
   * Extracts product name from .tw-text-600 element
   */
  function scrapeBlinkit() {
    return {
      name:
        document.querySelector(".tw-text-600")?.innerText.trim() ||
        "Product name not found",
    };
  }

  /**
   * BigBasket product scraper
   * Extracts product name from h1 element
   */
  function scrapeBigBasket() {
    return {
      name:
        document.querySelector("h1")?.innerText.trim() ||
        "Product name not found",
    };
  }

  /**
   * Swiggy product scraper
   * Extracts product name from h1 element
   */
  function scrapeSwiggy() {
    return {
      name:
        document.querySelector("h1")?.innerText.trim() ||
        "Product name not found",
    };
  }

  /**
   * JioMart product scraper
   * Extracts product name from .product-header-name element
   */
  function scrapeJioMart() {
    return {
      name:
        document.querySelector(".product-header-name")?.innerText.trim() ||
        "Product name not found",
    };
  }

  /**
   * Flipkart product scraper
   * Extracts product name from .VU-ZEz element
   */
  function scrapeFlipkart() {
    return {
      name:
        document.querySelector(".VU-ZEz")?.innerText.trim() ||
        "Product name not found",
    };
  }

  /**
   * Amazon product scraper
   * Extracts product name from #productTitle element
   */
  function scrapeAmazon() {
    return {
      name:
        document.querySelector("#productTitle")?.innerText.trim() ||
        "Product name not found",
    };
  }

  /**
   * Scraper router - from scrapers/index.js
   * Routes scraping requests to platform-specific scrapers based on hostname
   */
  const scraperMap = {
    "www.zeptonow.com": scrapeZepto,
    "www.blinkit.com": scrapeBlinkit,
    "www.bigbasket.com": scrapeBigBasket,
    "www.swiggy.com": scrapeSwiggy,
    "www.jiomart.com": scrapeJioMart,
    "www.flipkart.com": scrapeFlipkart,
    "www.amazon.in": scrapeAmazon,
  };

  /**
   * Scrapes product details from the current page
   * @returns {Object} Product details with name property
   */
  function scrapeProductDetails() {
    const hostname = window.location.hostname;
    const scraper = scraperMap[hostname];

    if (scraper) {
      return scraper();
    }

    return { name: "No product name found." };
  }

  // ============================================================================
  // DOM BUILDER UTILITIES
  // ============================================================================

  /**
   * Creates a div element with specified properties
   * @param {string} id - Element ID
   * @param {string} className - CSS class name
   * @param {string} textContent - Text content
   * @returns {HTMLDivElement} Created div element
   */
  function createDiv(id = "", className = "", textContent = "") {
    const div = document.createElement("div");
    if (id) div.id = id;
    if (className) div.classList.add(className);
    if (textContent) div.textContent = textContent;
    return div;
  }

  /**
   * Creates an image element
   * @param {string} src - Image source URL
   * @param {string} id - Element ID
   * @param {string} className - CSS class name
   * @returns {HTMLImageElement} Created image element
   */
  function createImage(src, id = "", className = "") {
    const img = document.createElement("img");
    img.src = src;
    if (id) img.id = id;
    if (className) img.classList.add(className);

    img.onerror = function () {
      img.src = chrome.runtime.getURL("assets/icons/food/no-image.png");
    };

    return img;
  }

  /**
   * Creates a show more/less toggle button
   * @param {HTMLElement} container - Parent container
   * @param {string} itemSelector - CSS selector for items to toggle
   * @param {number} collapsedCount - Number of items to show when collapsed
   * @returns {HTMLDivElement} Show more button element
   */
  function createShowMoreButton(
    container,
    itemSelector,
    collapsedCount = UI_CONFIG.COLLAPSED_ITEM_COUNT,
  ) {
    const showMoreDiv = createDiv("", "show-more", "Show More");

    showMoreDiv.addEventListener("click", () => {
      const items = container.querySelectorAll(itemSelector);
      items.forEach((item, index) => {
        if (index >= collapsedCount) {
          item.classList.toggle(`hide-${itemSelector.replace(".", "")}`);
        }
      });
      showMoreDiv.textContent =
        showMoreDiv.textContent === "Show More" ? "Show Less" : "Show More";
    });

    return showMoreDiv;
  }

  // ============================================================================
  // ICON LOADER UTILITIES
  // ============================================================================

  /**
   * Creates and appends an SVG element to a specified parent element
   * @param {string} svgString - The SVG string to be parsed and appended
   * @param {string} parentId - The ID of the parent element
   * @param {string} id - The ID to be assigned to the new SVG element
   * @param {string|null} fill - Optional fill color for the SVG
   * @param {function|null} clickHandler - Optional click handler for the SVG
   * @returns {Element} The appended SVG element
   */
  function createAndAppendSvg(
    svgString,
    parentId,
    id,
    fill = null,
    clickHandler = null,
  ) {
    const parentElement = document.getElementById(parentId);
    const parser = new DOMParser();
    const svgElement = parser.parseFromString(
      svgString,
      "image/svg+xml",
    ).documentElement;
    svgElement.id = id;

    if (fill) {
      for (const child of svgElement.children) {
        child.setAttribute("fill", fill);
      }
    }

    const iconDiv = document.createElement("div");
    iconDiv.id = "icon-div";
    iconDiv.appendChild(svgElement);
    parentElement.appendChild(iconDiv);

    if (clickHandler) {
      svgElement.addEventListener("click", clickHandler);
    }

    return svgElement;
  }

  /**
   * Creates an SVG element with specific styling
   * @param {string} svgString - SVG string content
   * @param {string} id - ID for the SVG element
   * @param {string} fill - Fill color
   * @param {function} clickHandler - Click event handler
   * @returns {Element} SVG element
   */
  function createSvgElement(
    svgString,
    id,
    fill = "white",
    clickHandler = null,
  ) {
    const parser = new DOMParser();
    const svgElement = parser.parseFromString(
      svgString,
      "image/svg+xml",
    ).documentElement;
    svgElement.id = id;

    if (fill) {
      for (const child of svgElement.children) {
        child.setAttribute("fill", fill);
      }
    }

    if (clickHandler) {
      svgElement.addEventListener("click", clickHandler);
    }

    return svgElement;
  }

  /**
   * Requests and appends an icon SVG to a specified parent element
   * @param {string} iconName - The name of the icon to be fetched
   * @param {string} parentId - The ID of the parent element
   * @param {string} id - The ID to be assigned to the new SVG element
   * @param {function|null} callback - Optional click handler for the SVG
   * @returns {Promise} A promise that resolves when the icon is appended
   */
  function getAndAppendIcon(iconName, parentId, id, callback = null) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { text: `fetchIcon${capitalize(iconName)}` },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (response && response.svg) {
            const element = createAndAppendSvg(
              response.svg,
              parentId,
              id,
              null,
              callback,
            );
            element.style.height = "16px";
            element.style.cursor = "pointer";
            resolve(element);
          } else {
            reject(new Error(`${iconName} Icon not received`));
          }
        },
      );
    });
  }

  // ============================================================================
  // SIDEBAR COMPONENT
  // ============================================================================

  /**
   * Creates the main product sidebar container
   * @returns {HTMLDivElement} Product body element
   */
  function createSidebar() {
    const productBody = document.createElement("div");
    productBody.id = "product-body";
    document.body.appendChild(productBody);
    return productBody;
  }

  /**
   * Creates and configures the icon button to toggle sidebar
   * @param {Object} productInfo - Product information data
   * @param {HTMLElement} productBody - The sidebar body element
   */
  async function createIconButton(productInfo, productBody) {
    const iconBtn = document.createElement("div");
    iconBtn.id = "product-btn";
    iconBtn.style.backgroundColor =
      productInfo.primary_score?.grade_color || "#757575";

    chrome.runtime.sendMessage({ text: "fetchIconM" }, (response) => {
      if (chrome.runtime.lastError) {
        return;
      } else if (response && response.svg) {
        const svgElement = createSvgElement(response.svg, "", "white", () => {
          productBody.style.display = "block";
        });
        const iconDiv = document.createElement("div");
        iconDiv.id = "icon-div";
        iconDiv.appendChild(svgElement);
        iconBtn.appendChild(iconDiv);
      }
    });

    document.body.appendChild(iconBtn);
  }

  /**
   * Creates the navigation bar for the sidebar
   * @param {HTMLElement} productBody - The sidebar body element
   * @returns {HTMLDivElement} Navigation element
   */
  async function createNavigation(productBody) {
    const productNav = document.createElement("div");
    productNav.id = "product-nav";
    productBody.appendChild(productNav);

    await getAndAppendIcon("mivro", "product-nav", "mivro-svg");

    const functionIconDiv = document.createElement("div");
    functionIconDiv.id = "function-icon-div";
    productNav.appendChild(functionIconDiv);

    await getAndAppendIcon("flag", "function-icon-div", "flag-svg");

    let isHeartFilled = false;

    function toggleHeartIcon() {
      const action = isHeartFilled ? "fetchHeartSvg" : "fetchHeartFilledSvg";
      chrome.runtime.sendMessage({ text: action }, (response) => {
        if (chrome.runtime.lastError) {
          return;
        }
        if (response && response.svg) {
          const parser = new DOMParser();
          const newSvgNode = parser.parseFromString(
            response.svg,
            "image/svg+xml",
          ).documentElement;
          newSvgNode.style.height = "16px";
          newSvgNode.style.cursor = "pointer";
          newSvgNode.id = "heart-svg";

          const heartIcon = document.getElementById("heart-svg");
          heartIcon.replaceWith(newSvgNode);

          newSvgNode.addEventListener("click", toggleHeartIcon);
          isHeartFilled = !isHeartFilled;
        }
      });
    }

    await getAndAppendIcon(
      "heart",
      "function-icon-div",
      "heart-svg",
      toggleHeartIcon,
    );
    await getAndAppendIcon("share", "function-icon-div", "share-svg");
    await getAndAppendIcon("close", "function-icon-div", "close-svg", () => {
      productBody.style.display = "none";
    });

    return productNav;
  }

  // ============================================================================
  // PRODUCT INFO COMPONENT
  // ============================================================================

  /**
   * Gets the first image URL from selected images object
   * @param {Object} selectedImages - Selected images object
   * @returns {string} First image URL
   */
  function getFirstImageUrl(selectedImages) {
    for (const key in selectedImages) {
      if (selectedImages.hasOwnProperty(key)) {
        return selectedImages[key];
      }
    }
    return "";
  }

  /**
   * Creates the score section using unified primary_score from backend
   * @param {Object} productInfo - Product information data
   * @returns {HTMLDivElement} Score container element
   */
  function createScoreSection(productInfo) {
    const scoreContainer = createDiv("score-container");
    const primaryScore = productInfo.primary_score;

    if (primaryScore && primaryScore.grade) {
      const scoreInfoContainer = createDiv("score-info-container");
      scoreContainer.appendChild(scoreInfoContainer);

      const scoreValue = createDiv(
        "score-value",
        "",
        primaryScore.score !== undefined && primaryScore.score !== null
          ? `${primaryScore.score}/100`
          : "N/A",
      );
      scoreInfoContainer.appendChild(scoreValue);

      const scoreAssessment = createDiv(
        "score-assessment",
        "",
        primaryScore.assessment,
      );
      scoreInfoContainer.appendChild(scoreAssessment);

      const scoreGradeDiv = createDiv("score-grade", "", primaryScore.grade);
      scoreGradeDiv.style.color = primaryScore.grade_color;
      scoreContainer.appendChild(scoreGradeDiv);
    } else {
      const scoreInfoContainer = createDiv("score-info-container");
      const scoreValue = createDiv("score-value", "", "N/A");
      const scoreAssessment = createDiv(
        "score-assessment",
        "",
        "Nutritional Quality",
      );
      scoreInfoContainer.appendChild(scoreValue);
      scoreInfoContainer.appendChild(scoreAssessment);
      scoreContainer.appendChild(scoreInfoContainer);

      const scoreGradeDiv = createDiv("score-grade", "", "N/A");
      scoreGradeDiv.style.color = "#9aa5b1";
      scoreContainer.appendChild(scoreGradeDiv);
    }

    return scoreContainer;
  }

  /**
   * Creates the product info container
   * @param {Object} productInfo - Product information data
   * @returns {HTMLDivElement} Product info container element
   */
  function createProductInfoSection(productInfo) {
    const productInfoContainer = createDiv("product-info-container");
    const productInfoContainerMain = createDiv("product-info-container-main");
    productInfoContainer.appendChild(productInfoContainerMain);

    const productImageContainer = createDiv("product-image-container");
    const imageUrl = getFirstImageUrl(productInfo.selected_images);
    const productImage = createImage(imageUrl, "product-image");
    productImageContainer.appendChild(productImage);
    productInfoContainerMain.appendChild(productImageContainer);

    const productMainInfo = createDiv("product-main-info");
    productInfoContainerMain.appendChild(productMainInfo);

    const productName = createDiv("product-name", "", productInfo.product_name);
    productMainInfo.appendChild(productName);

    const brandName = createDiv("brand-name", "", productInfo.brands);
    productMainInfo.appendChild(brandName);

    const scoreContainer = createScoreSection(productInfo);
    productMainInfo.appendChild(scoreContainer);

    return productInfoContainer;
  }

  // ============================================================================
  // NUTRIENTS COMPONENT
  // ============================================================================

  /**
   * Creates a single nutrient item
   * @param {Object} nutrient - Nutrient data object
   * @returns {HTMLDivElement} Nutrient element
   */
  function createNutrientItem(nutrient) {
    const nutrientDiv = createDiv("", "nutrient");

    const leftDiv = createDiv("", "nutrient-left");
    const nutrientIcon = createImage(
      chrome.runtime.getURL(`assets/icons/food/${nutrient.icon}.png`),
      "",
      "nutrient-icon",
    );
    leftDiv.appendChild(nutrientIcon);
    nutrientDiv.appendChild(leftDiv);

    const centerDiv = createDiv("", "nutrient-center");
    const nutrientName = createDiv("", "nutrient-name", nutrient.name);
    const nutrientText = createDiv("", "nutrient-text", nutrient.text);
    centerDiv.appendChild(nutrientName);
    centerDiv.appendChild(nutrientText);
    nutrientDiv.appendChild(centerDiv);

    const rightDiv = createDiv("", "nutrient-right");
    const quantityDiv = createDiv("", "nutrient-quantity", nutrient.quantity);
    const colorDiv = createDiv("", "nutrient-color");
    colorDiv.style.backgroundColor = nutrient.color;
    rightDiv.appendChild(quantityDiv);
    rightDiv.appendChild(colorDiv);
    nutrientDiv.appendChild(rightDiv);

    return nutrientDiv;
  }

  /**
   * Creates a nutrient container (negatives or positives)
   * @param {string} containerId - Container ID
   * @param {string} title - Container title
   * @param {Array} nutrients - Array of nutrient objects
   * @returns {HTMLDivElement} Nutrient container element
   */
  function createNutrientContainer(containerId, title, nutrients) {
    const container = createDiv(containerId, "grade-container");

    const titleDiv = createDiv(`${containerId}-title`, "grade-title", title);
    container.appendChild(titleDiv);

    const errorContainer = createDiv(`${containerId}-error`);
    container.appendChild(errorContainer);

    if (!nutrients || nutrients.length === 0) {
      const errorDiv = createDiv("", "error", MESSAGES.NO_DATA);
      errorContainer.appendChild(errorDiv);
      return container;
    }

    nutrients.forEach((nutrient, index) => {
      const nutrientDiv = createNutrientItem(nutrient);

      if (index >= UI_CONFIG.COLLAPSED_ITEM_COUNT) {
        nutrientDiv.classList.add("hide-nutrient");
      }

      container.appendChild(nutrientDiv);
    });

    if (nutrients.length > UI_CONFIG.COLLAPSED_ITEM_COUNT) {
      const showMoreButton = createShowMoreButton(container, ".nutrient");
      container.appendChild(showMoreButton);
    }

    return container;
  }

  // ============================================================================
  // INGREDIENTS COMPONENT
  // ============================================================================

  /**
   * Creates a single ingredient item
   * @param {Object} ingredient - Ingredient data object
   * @returns {HTMLDivElement} Ingredient element
   */
  function createIngredientItem(ingredient) {
    const ingredientDiv = createDiv("", "ingredient");

    const ingredientIconDiv = createDiv("", "ingredient-icon-div");
    const ingredientIcon = createImage(
      chrome.runtime.getURL(`assets/icons/food/${ingredient.icon}.png`),
      "",
      "ingredient-icon",
    );
    ingredientIconDiv.appendChild(ingredientIcon);
    ingredientDiv.appendChild(ingredientIconDiv);

    const ingredientNameDiv = createDiv("", "ingredient-name", ingredient.name);
    ingredientDiv.appendChild(ingredientNameDiv);

    const ingredientQuantityDiv = createDiv(
      "",
      "ingredient-quantity",
      ingredient.percentage,
    );
    ingredientDiv.appendChild(ingredientQuantityDiv);

    return ingredientDiv;
  }

  /**
   * Creates the ingredients container
   * @param {Array} ingredients - Array of ingredient objects
   * @returns {HTMLDivElement} Ingredients container element
   */
  function createIngredientsSection(ingredients) {
    const ingredientContainer = createDiv("ingredient-container");

    const ingredientTitle = createDiv(
      "ingredient-title",
      "grade-title",
      "Ingredients",
    );
    ingredientContainer.appendChild(ingredientTitle);

    if (!ingredients || ingredients.length === 0) {
      const errorDiv = createDiv("", "error", MESSAGES.NO_DATA);
      ingredientContainer.appendChild(errorDiv);
      return ingredientContainer;
    }

    ingredients.forEach((ingredient, index) => {
      const ingredientDiv = createIngredientItem(ingredient);

      if (index >= UI_CONFIG.COLLAPSED_ITEM_COUNT) {
        ingredientDiv.classList.add("hide-ingredient");
      }

      ingredientContainer.appendChild(ingredientDiv);
    });

    if (ingredients.length > UI_CONFIG.COLLAPSED_ITEM_COUNT) {
      const showMoreButton = createShowMoreButton(
        ingredientContainer,
        ".ingredient",
      );
      ingredientContainer.appendChild(showMoreButton);
    }

    return ingredientContainer;
  }

  /**
   * Creates the Nova group section
   * @param {Object} productInfo - Product information data
   * @returns {HTMLDivElement} Nova group container element
   */
  function createNovaGroupSection(productInfo) {
    const novaGroupContainer = createDiv("nova-group-container");

    const novaGroupTitle = createDiv(
      "allergies-title",
      "grade-title",
      "Nova Group",
    );
    novaGroupContainer.appendChild(novaGroupTitle);

    const novaGroup = createDiv("nova-group", "nova-group");
    novaGroupContainer.appendChild(novaGroup);

    const novaGroupNumberDiv = createDiv("", "nova-group-number-div");
    const novaGroupNumber = createImage(
      chrome.runtime.getURL(`assets/icons/food/${productInfo.nova_group}.png`),
      "",
      "nova-group-number",
    );
    novaGroupNumberDiv.appendChild(novaGroupNumber);
    novaGroup.appendChild(novaGroupNumberDiv);

    const novaGroupText = createDiv("", "", productInfo.nova_group_name);
    novaGroup.appendChild(novaGroupText);

    return novaGroupContainer;
  }

  /**
   * Creates the health risks section
   * @param {Object} healthRisk - Health risk data
   * @returns {HTMLDivElement} Health container element
   */
  function createHealthRisksSection(healthRisk) {
    const healthContainer = createDiv("additives-container");

    const healthTitle = createDiv(
      "health-title",
      "grade-title",
      "Health Risks",
    );
    healthContainer.appendChild(healthTitle);

    if (
      !healthRisk ||
      Object.keys(healthRisk).length === 0 ||
      !healthRisk.ingredient_warnings ||
      healthRisk.ingredient_warnings.length === 0
    ) {
      const errorDiv = createDiv("", "error", MESSAGES.NO_DATA);
      healthContainer.appendChild(errorDiv);
      return healthContainer;
    }

    healthRisk.ingredient_warnings.forEach((warning, index) => {
      const healthDiv = createDiv("", "health");

      // Parse the warning object
      let warningData;
      if (typeof warning === "string") {
        try {
          warningData = JSON.parse(warning);
        } catch {
          warningData = { issue: warning, reasoning: "" };
        }
      } else {
        warningData = warning;
      }

      // Create issue title
      const issueDiv = createDiv(
        "",
        "health-issue",
        warningData.issue || "Health Concern",
      );
      healthDiv.appendChild(issueDiv);

      // Create reasoning text
      if (warningData.reasoning) {
        const reasoningDiv = createDiv(
          "",
          "health-reasoning",
          warningData.reasoning,
        );
        healthDiv.appendChild(reasoningDiv);
      }

      if (index >= UI_CONFIG.HEALTH_COLLAPSED_COUNT) {
        healthDiv.classList.add("hide-health");
      }

      healthContainer.appendChild(healthDiv);
    });

    if (
      healthRisk.ingredient_warnings.length > UI_CONFIG.HEALTH_COLLAPSED_COUNT
    ) {
      const showMoreButton = createShowMoreButton(
        healthContainer,
        ".health",
        UI_CONFIG.HEALTH_COLLAPSED_COUNT,
      );
      healthContainer.appendChild(showMoreButton);
    }

    return healthContainer;
  }

  // ============================================================================
  // RECOMMENDATIONS COMPONENT
  // ============================================================================

  /**
   * Creates the recommendation section
   * @param {Object} recommendedProduct - Recommended product data
   * @returns {HTMLDivElement} Recommendation container element
   */
  function createRecommendationSection(recommendedProduct) {
    const container = createDiv();
    container.classList.add("recommendation-section");

    const recommendationTitle = createDiv(
      "recommendation-title",
      "grade-title",
      "Recommendation",
    );
    container.appendChild(recommendationTitle);

    if (!recommendedProduct || recommendedProduct.error) {
      const errorDiv = createDiv("", "error", MESSAGES.NO_DATA);
      container.appendChild(errorDiv);
      return container;
    }

    const recommendation = createDiv("product-info-container-main");
    recommendation.classList.add("recommendation-card");
    container.appendChild(recommendation);

    const productImageContainer = createDiv("product-image-container");
    productImageContainer.classList.add("recommendation-image");
    recommendation.appendChild(productImageContainer);

    if (!recommendedProduct.selected_images) {
      const productImage = createImage(
        chrome.runtime.getURL("assets/icons/misc/no-database.png"),
        "",
        "no-database",
      );
      productImageContainer.appendChild(productImage);

      const productMainInfo = createDiv("product-main-info");
      recommendation.appendChild(productMainInfo);

      const productName = createDiv(
        "product-name",
        "",
        recommendedProduct.product_name,
      );
      productMainInfo.appendChild(productName);
    } else {
      const imageUrl = getFirstImageUrl(recommendedProduct.selected_images);
      const productImage = createImage(imageUrl, "product-image");
      productImageContainer.appendChild(productImage);

      const productMainInfo = createDiv("product-main-info");
      recommendation.appendChild(productMainInfo);

      const productName = createDiv(
        "product-name",
        "",
        recommendedProduct.product_name,
      );
      productMainInfo.appendChild(productName);

      const brandName = createDiv("brand-name", "", recommendedProduct.brands);
      productMainInfo.appendChild(brandName);
    }

    return container;
  }

  // ============================================================================
  // MAIN CONTENT SCRIPT LOGIC
  // ============================================================================

  const productDetails = scrapeProductDetails();
  const productName = productDetails.name;
  const searchQuery = extractSearchKeywords(productName);

  chrome.runtime.sendMessage(
    { text: "fetchProductInfo", product: searchQuery },
    async (response) => {
      if (chrome.runtime.lastError) {
        return;
      }

      const productBody = createSidebar();

      if (!response || response.error || !response.productInfo) {
        await createIconButton(
          { product_name: productName, nutriscore_grade_color: "#757575" },
          productBody,
        );
        await createNavigation(productBody);

        const errorContainer = createDiv("product-info-container");
        const errorMain = createDiv("product-not-found-container");
        errorContainer.appendChild(errorMain);

        const iconImg = createImage(
          chrome.runtime.getURL("assets/icons/misc/no-database.png"),
          "product-not-found-icon",
        );
        errorMain.appendChild(iconImg);

        const titleDiv = createDiv(
          "product-not-found-title",
          "",
          "Product Not Found",
        );
        errorMain.appendChild(titleDiv);

        const messageDiv = createDiv(
          "product-not-found-message",
          "",
          "This product is not available in our database yet. We're constantly expanding our catalog.",
        );
        errorMain.appendChild(messageDiv);

        productBody.appendChild(errorContainer);
        return;
      }

      const productInfo = response.productInfo;

      await createIconButton(productInfo, productBody);
      await createNavigation(productBody);

      const productInfoContainer = createProductInfoSection(productInfo);
      productBody.appendChild(productInfoContainer);

      const negativesContainer = createNutrientContainer(
        "negatives-container",
        "Negatives",
        productInfo.nutriments?.negative_nutrient || [],
      );
      productInfoContainer.appendChild(negativesContainer);

      const positivesContainer = createNutrientContainer(
        "positives-container",
        "Positives",
        productInfo.nutriments?.positive_nutrient || [],
      );
      productInfoContainer.appendChild(positivesContainer);

      const ingredientsSection = createIngredientsSection(
        productInfo.ingredients || [],
      );
      productInfoContainer.appendChild(ingredientsSection);

      const novaGroupSection = createNovaGroupSection(productInfo);
      productInfoContainer.appendChild(novaGroupSection);

      const healthRisksSection = createHealthRisksSection(
        productInfo.health_risk || {},
      );
      productInfoContainer.appendChild(healthRisksSection);

      const recommendationSection = createRecommendationSection(
        productInfo.recommended_product || {},
      );
      productInfoContainer.appendChild(recommendationSection);
    },
  );
})();
