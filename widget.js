document.addEventListener("DOMContentLoaded", function () {
  const btn = document.createElement("div");
  btn.innerText = "Asistente CliBot";
  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.backgroundColor = "#4f46e5";
  btn.style.color = "white";
  btn.style.padding = "12px 18px";
  btn.style.borderRadius = "30px";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
  btn.style.zIndex = "9999";
  btn.style.fontFamily = "Arial, sans-serif";
  btn.style.fontSize = "14px";

  btn.onclick = () => {
    window.open("https://t.me/clibotassistant_bot", "_blank");
  };

  document.body.appendChild(btn);
});
