function clearTableBody(tableElement) {
  while (tableElement.rows.length > 1) {
    tableElement.deleteRow(1);
  }
}

function addTableRow(tableElement, firstValue, secondValue) {
  const tableRow = document.createElement("tr");
  const firstCell = document.createElement("td");
  const secondCell = document.createElement("td");

  firstCell.textContent = firstValue;
  secondCell.textContent = secondValue;
  tableRow.appendChild(firstCell);
  tableRow.appendChild(secondCell);
  tableElement.append(tableRow);
}

async function loadUpSite(event) {
  if (event) {
    event.preventDefault();
  }

  const productTable = document.getElementById("productTable");
  const slowProductTable = document.getElementById("slowProductTable");
  const loadingMessage = document.getElementById("loadingMessage");
  const searchInput = document.querySelector('input[type="text"]');

  const searchQuery =
    (searchInput?.value || "javascript").trim() || "javascript";

  clearTableBody(productTable);
  clearTableBody(slowProductTable);
  slowProductTable.style.display = "none";

  const slowProductsPromise = fetch("http://localhost:3000/products").then(
    (result) => {
      if (!result.ok) {
        throw new Error(`Products request failed with status ${result.status}`);
      }
      return result.json();
    },
  );

  try {
    const bookResponse = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=8`,
    );

    if (!bookResponse.ok) {
      throw new Error(`Book request failed with status ${bookResponse.status}`);
    }

    const bookData = await bookResponse.json();
    const books = bookData.docs || [];

    if (books.length === 0) {
      addTableRow(productTable, "No books found", "Try another search term");
    } else {
      books.forEach((book) => {
        const title = book.title || "Untitled";
        const author =
          book.author_name && book.author_name.length > 0
            ? book.author_name[0]
            : "Unknown Author";
        addTableRow(productTable, title, author);
      });
    }
  } catch (error) {
    addTableRow(
      productTable,
      "Could not load books",
      "Check internet connection",
    );
    console.error(error);
  }

  loadingMessage.style.display = "block";
  let shouldShowSlowProductTable = true;
  try {
    const slowProductsAwaited = await slowProductsPromise;

    if (
      !Array.isArray(slowProductsAwaited) ||
      slowProductsAwaited.length === 0
    ) {
      addTableRow(
        slowProductTable,
        "No local products",
        "Nothing returned from API",
      );
    } else {
      slowProductsAwaited.forEach((product) => {
        addTableRow(
          slowProductTable,
          product.title || "Untitled Product",
          product.category || "Uncategorized",
        );
      });
    }
  } catch (error) {
    shouldShowSlowProductTable = false;
    console.error(error);
  } finally {
    loadingMessage.style.display = "none";
    slowProductTable.style.display = shouldShowSlowProductTable
      ? "table"
      : "none";
  }
}

window.addEventListener("load", () => {
  const form = document.querySelector("form");
  form?.addEventListener("submit", loadUpSite);
  loadUpSite();
});
