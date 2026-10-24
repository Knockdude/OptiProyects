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
        description: "Juegos y aplicaciones para celulares Android",
        items: [
            {
                name: "LiteCraft PE",
                tag: "ANDROID",
                downloads: [
                    {
                        text: "Descargar LiteCraft PE móvil",
                        link: "PEGA_AQUI_EL_LINK_DE_LITECRAFT_MOVIL"
                    },
                    {
                        text: "Descargar LiteCraft PE PC",
                        link: "PEGA_AQUI_EL_LINK_DE_LITECRAFT_PC"
                    }
                ]
            }
        ]
    }
];

var defaultCategory = 0;
var mainContainer = document.querySelector("main");
var categoryContainer = document.querySelector("ul.categories");
var itemContainer = document.querySelector("ul.items");
var buttonContainer = document.querySelector("div.downloadButtons");
var downloadsContainer = document.querySelector("section.downloads");
var categoryDescription = document.querySelector(".boxTitle span");
var searchBox = document.getElementById("optiSearch");

var currentCategory = undefined;
var selectedItem = undefined;
var renderedItems = [];
var renderedElements = [];
var searchTimer = null;
var lastSearchValue = "";

function childIndex(parent, child) {
    for (; child && child.parentNode !== parent;) {
        child = child.parentNode;
    }

    if (!child) return -1;

    var children = parent.children;

    for (var i = 0; i < children.length; i++) {
        if (children[i] === child) return i;
    }

    return -1;
}

function createCategories() {
    if (!content || !content.length) return;

    var fragment = document.createDocumentFragment();

    for (var t = 0; t < content.length; t++) {
        var li = document.createElement("li");
        li.textContent = content[t].title;
        fragment.appendChild(li);
    }

    categoryContainer.appendChild(fragment);
}

categoryContainer.addEventListener("click", function(e) {
    var idx = childIndex(categoryContainer, e.target);

    if (idx !== -1) changeCategory(idx);
});

function changeCategory(idx) {
    if (idx === currentCategory) return;

    searchBox.value = "";
    lastSearchValue = "";
    itemContainer.innerHTML = "";
    buttonContainer.innerHTML = "";
    downloadsContainer.style.display = "";

    if (currentCategory !== undefined) {
        categoryContainer.children[currentCategory]
            .classList.remove("selected");
    }

    categoryContainer.children[idx].classList.add("selected");

    categoryDescription.textContent = content[idx].description;

    createItems(content[idx].items);

    currentCategory = idx;
    selectedItem = undefined;

    if (content[idx].items.length > 0) {
        selectItem(content[idx].items[0], 0);
    }
}

function addTag(element, text, className) {
    var span = document.createElement("span");
    span.textContent = text;
    span.className = className;
    element.appendChild(span);
}

function buildItemLi(item) {
    var li = document.createElement("li");
    var span = document.createElement("span");

    span.className = "name";
    span.textContent = item.name;
    li.appendChild(span);

    if (item.tag !== undefined) {
        addTag(li, item.tag, "tag");
    }

    var index = renderedItems.length;

    renderedItems.push(item);
    renderedElements.push(li);

    li.addEventListener("click", function() {
        selectItem(item, index);
    });

    return li;
}

function createItems(items) {
    renderedItems = [];
    renderedElements = [];
    itemContainer.innerHTML = "";

    if (!items || !items.length) return;

    var fragment = document.createDocumentFragment();

    for (var t = 0; t < items.length; t++) {
        fragment.appendChild(buildItemLi(items[t]));
    }

    itemContainer.appendChild(fragment);
}

function selectItem(item, idx) {
    if (idx === selectedItem) return;

    buttonContainer.innerHTML = "";
    buttonContainer.classList.remove("multiple");
    downloadsContainer.style.display = "";

    if (renderedElements[idx]) {
        renderedElements[idx].classList.add("selected");
    }

    if (
        selectedItem !== undefined &&
        renderedElements[selectedItem]
    ) {
        renderedElements[selectedItem].classList.remove("selected");
    }

    var downloads = item.downloads || (
        item.link
            ? [{
                text: item.buttonText || "Descargar",
                link: item.link
            }]
            : []
    );

    if (downloads.length > 1) {
        buttonContainer.classList.add("multiple");
    }

    if (downloads.length > 0) {
        downloads.forEach(function(download) {
            var btn = document.createElement("a");

            btn.textContent = download.text;
            btn.href = download.link;
            btn.target = "_blank";
            btn.rel = "noopener noreferrer";
            btn.style.cursor = "pointer";

            buttonContainer.appendChild(btn);
        });
    } else {
        var placeholder = document.createElement("a");

        placeholder.className = "placeholder";
        placeholder.textContent = "Próximamente";
        buttonContainer.appendChild(placeholder);
    }

    selectedItem = idx;
}

function onSearchInput() {
    if (searchBox.value === lastSearchValue) return;

    clearTimeout(searchTimer);

    searchTimer = setTimeout(function() {
        if (searchBox.value === lastSearchValue) return;

        lastSearchValue = searchBox.value;

        if (searchBox.value.trim() !== "") {
            search(searchBox.value);
        } else {
            changeCategory(
                currentCategory === undefined
                    ? defaultCategory
                    : currentCategory
            );
        }
    }, 150);
}

searchBox.addEventListener("input", onSearchInput);

function search(query) {
    itemContainer.innerHTML = "";
    buttonContainer.innerHTML = "";
    buttonContainer.classList.remove("multiple");

    query = query.toLowerCase().trim();

    var filtered = [];

    for (var i = 0; i < content.length; i++) {
        for (var j = 0; j < content[i].items.length; j++) {
            var item = content[i].items[j];

            if (item.name.toLowerCase().indexOf(query) !== -1) {
                filtered.push(item);
            }
        }
    }

    currentCategory = undefined;

    Array.from(categoryContainer.children).forEach(function(category) {
        category.classList.remove("selected");
    });

    if (filtered.length) {
        categoryDescription.textContent = "Resultados de búsqueda";

        createItems(filtered);
        selectItem(renderedItems[0], 0);
    } else {
        categoryDescription.textContent = "Búsqueda - Sin resultados";
        downloadsContainer.style.display = "none";
    }
}

function closeOverlay() {
    document.getElementById("overlay").style.display = "none";
}

searchBox.value = "";
createCategories();
changeCategory(defaultCategory);

var dmcaLink = document.getElementById("dmcaLink");

if (dmcaLink) {
    dmcaLink.addEventListener("click", function(e) {
        e.preventDefault();
        alert("DMCA: consultasopti@gmail.com");
    });
}
