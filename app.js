var content = [
    {
        title: "Mix",
        description: "Sección Mix con Opticraft Java y GTA 5",
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
    for (; child && child.parentNode !== parent;) child = child.parentNode;
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
    categoryContainer.children[idx].classList.add("selected");
    if (currentCategory !== undefined) {
        categoryContainer.children[currentCategory].classList.remove("selected");
    }
    categoryDescription.textContent = content[idx].description;
    createItems(content[idx].items);
    currentCategory = idx;
    selectedItem = undefined;
    selectItem(content[currentCategory].items[0], 0);
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

    if (item.tag !== undefined) addTag(li, item.tag, "tag");

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
    downloadsContainer.style.display = "";
    renderedElements[idx].classList.add("selected");

    if (selectedItem !== undefined && renderedElements[selectedItem]) {
        renderedElements[selectedItem].classList.remove("selected");
    }

    if (item.link) {
        var btn = document.createElement("a");
        btn.textContent = item.buttonText;
        btn.href = item.link;
        btn.target = "_blank";
        btn.style.cursor = "pointer";
        buttonContainer.appendChild(btn);
    } else {
        var placeholder = document.createElement("a");
        placeholder.className = "placeholder";
        placeholder.textContent = "Selecciona una opción de abajo";
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
        if (searchBox.value !== "") {
            search(searchBox.value);
        } else {
            changeCategory(defaultCategory);
        }
    }, 150);
}

searchBox.addEventListener("input", onSearchInput);

function search(query) {
    itemContainer.innerHTML = "";
    query = query.toLowerCase();
    var filtered = [];

    for (var i = 0; i < content[0].items.length; i++) {
        var item = content[0].items[i];
        if (item.name.toLowerCase().indexOf(query) !== -1) {
            filtered.push(item);
        }
    }

    if (filtered.length) {
        categoryDescription.textContent = "Búsqueda";
        createItems(filtered);
        selectItem(renderedItems[0], 0);
    } else {
        categoryDescription.textContent = "Búsqueda - Sin resultados";
        downloadsContainer.style.display = "none";
        buttonContainer.innerHTML = "";
    }
}

function closeOverlay() {
    document.getElementById("overlay").style.display = "none";
}

// Inicialización de la aplicación
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