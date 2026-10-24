var content = [
    {
        title: "Mix",
        description: "Sección Mix con OptiCraft Java y GTA 5",
        items: [
            {
                name: "OptiCraft: JAVA",
                tag: "JAVA",
                link: "https://gofile.io/d/a7fe4538-93ca-46ae-be94-41e40ce3afe3",
                buttonText: "Descargar Java Launcher"
            },
            {
                name: "GTA: V",
                tag: "64 BITS",
                link: "https://gofile.io/d/a3db758e-ee45-426a-9e33-af38cb4b4dfc",
                buttonText: "Descargar"
            }
        ]
    },
    {
        title: "Celulares",
        description: "Juegos y aplicaciones para celulares",
        items: [
            {
                name: "LiteCraft PE",
                tag: "ANDROID",
                downloads: [
                    {
                        text: "Descargar LiteCraft PE móvil",
                        link: ""
                    },
                    {
                        text: "Descargar LiteCraft PE PC",
                        link: ""
                    }
                ]
            }
        ]
    }
];

var defaultCategory = 0;
var categoryContainer = document.querySelector("ul.categories");
var itemContainer = document.querySelector("ul.items");
var buttonContainer = document.querySelector("div.downloadButtons");
var downloadsContainer = document.querySelector("section.downloads");
var categoryDescription = document.querySelector(".boxTitle span");
var searchBox = document.getElementById("optiSearch");

var currentCategory;
var selectedItem;
var renderedItems = [];
var renderedElements = [];
var searchTimer = null;

function createCategories() {
    categoryContainer.innerHTML = "";

    content.forEach(function(category, index) {
        var li = document.createElement("li");
        li.textContent = category.title;
        li.dataset.index = index;
        categoryContainer.appendChild(li);
    });
}

categoryContainer.addEventListener("click", function(e) {
    var li = e.target.closest("li");

    if (!li || !categoryContainer.contains(li)) return;

    changeCategory(Number(li.dataset.index));
});

function changeCategory(idx) {
    if (!content[idx]) return;

    currentCategory = idx;
    selectedItem = undefined;
    searchBox.value = "";

    Array.from(categoryContainer.children).forEach(function(li, i) {
        li.classList.toggle("selected", i === idx);
    });

    categoryDescription.textContent = content[idx].description;

    downloadsContainer.style.display = "";
    buttonContainer.innerHTML = "";
    buttonContainer.classList.remove("multiple");

    createItems(content[idx].items);

    if (renderedItems.length) {
        selectItem(renderedItems[0], 0);
    } else {
        showPlaceholder("Próximamente");
    }
}

function addTag(element, text) {
    var span = document.createElement("span");
    span.className = "tag";
    span.textContent = text;
    element.appendChild(span);
}

function buildItemLi(item, index) {
    var li = document.createElement("li");
    var name = document.createElement("span");

    name.className = "name";
    name.textContent = item.name;
    li.appendChild(name);

    if (item.tag) {
        addTag(li, item.tag);
    }

    li.addEventListener("click", function() {
        selectItem(item, index);
    });

    return li;
}

function createItems(items) {
    itemContainer.innerHTML = "";
    renderedItems = [];
    renderedElements = [];

    items.forEach(function(item, index) {
        renderedItems.push(item);

        var li = buildItemLi(item, index);
        renderedElements.push(li);
        itemContainer.appendChild(li);
    });
}

function showPlaceholder(message) {
    buttonContainer.innerHTML = "";
    buttonContainer.classList.remove("multiple");

    var placeholder = document.createElement("a");
    placeholder.className = "placeholder";
    placeholder.textContent = message;
    placeholder.href = "#";

    placeholder.addEventListener("click", function(e) {
        e.preventDefault();
    });

    buttonContainer.appendChild(placeholder);
}

function selectItem(item, idx) {
    if (!item || !renderedElements[idx]) return;

    if (selectedItem !== undefined &&
        renderedElements[selectedItem]) {
        renderedElements[selectedItem].classList.remove("selected");
    }

    selectedItem = idx;
    renderedElements[idx].classList.add("selected");

    buttonContainer.innerHTML = "";
    buttonContainer.classList.remove("multiple");
    downloadsContainer.style.display = "";

    var downloads = item.downloads || (
        item.link
            ? [{
                text: item.buttonText || "Descargar",
                link: item.link
            }]
            : []
    );

    if (!downloads.length) {
        showPlaceholder("Próximamente");
        return;
    }

    if (downloads.length > 1) {
        buttonContainer.classList.add("multiple");
    }

    downloads.forEach(function(download) {
        var btn = document.createElement("a");

        btn.textContent = download.text;

        if (download.link) {
            btn.href = download.link;
            btn.target = "_blank";
            btn.rel = "noopener noreferrer";
        } else {
            btn.href = "#";

            btn.addEventListener("click", function(e) {
                e.preventDefault();
                alert("Este enlace de descarga todavía no está configurado.");
            });
        }

        buttonContainer.appendChild(btn);
    });
}

function search(query) {
    var normalized = query.toLowerCase().trim();
    var filtered = [];

    content.forEach(function(category, categoryIndex) {
        category.items.forEach(function(item) {
            if (item.name.toLowerCase().includes(normalized)) {
                filtered.push({
                    item: item,
                    categoryIndex: categoryIndex
                });
            }
        });
    });

    currentCategory = undefined;
    selectedItem = undefined;

    Array.from(categoryContainer.children).forEach(function(li) {
        li.classList.remove("selected");
    });

    downloadsContainer.style.display = "";

    categoryDescription.textContent = filtered.length
        ? "Resultados de búsqueda"
        : "Búsqueda - Sin resultados";

    createItems(filtered.map(function(result) {
        return result.item;
    }));

    if (renderedItems.length) {
        selectItem(renderedItems[0], 0);
    } else {
        showPlaceholder("Sin resultados");
    }
}

searchBox.addEventListener("input", function() {
    clearTimeout(searchTimer);

    searchTimer = setTimeout(function() {
        var query = searchBox.value.trim();

        if (query) {
            search(query);
        } else {
            changeCategory(
                currentCategory === undefined
                    ? defaultCategory
                    : currentCategory
            );
        }
    }, 150);
});

function closeOverlay() {
    document.getElementById("overlay").style.display = "none";
}

var dmcaLink = document.getElementById("dmcaLink");

if (dmcaLink) {
    dmcaLink.addEventListener("click", function(e) {
        e.preventDefault();
        alert("DMCA: consultasopti@gmail.com");
    });
}

createCategories();
changeCategory(defaultCategory);
