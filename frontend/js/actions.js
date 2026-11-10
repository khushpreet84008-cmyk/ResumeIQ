$("againBtn").addEventListener("click", () => {
  setFile(null);
  input.value = "";
  $("results").hidden = true;
  document.getElementById("analyze").scrollIntoView({ behavior: "smooth" });
});

$("printBtn").addEventListener("click", () => window.print());

