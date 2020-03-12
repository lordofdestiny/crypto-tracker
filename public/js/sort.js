const sortAscVal = document.getElementById("sortAscVal");
const sortDescVal = document.getElementById("sortDescVal");
const sortAscName = document.getElementById("sortAscName");
const sortDescName = document.getElementById("sortDescName");

[sortAscVal, sortDescVal, sortAscName, sortDescName].forEach(button => {
  button.addEventListener("click", function() {
    const value = this.dataset.sortdir;
    const myLoc = new URL(location.pathname, location.href).href;
    window.location.replace(myLoc + `?sort=${value}`);
  });
});
