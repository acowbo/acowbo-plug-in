(() => {
  let drawing = false;
  let canvas, ctx;

  function initCanvas() {
    if (document.getElementById('drawingCanvas')) return; // 防止重复添加canvas
    canvas = document.createElement("canvas");
    canvas.id = 'drawingCanvas';
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = 10000;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
    ctx.lineWidth = 5;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        canvas.remove();
        document.removeEventListener("keydown", this);
      }
    });
  }

  function startDrawing(event) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.clientX, event.clientY);
  }

  function draw(event) {
    if (!drawing) return;
    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
  }

  function stopDrawing() {
    drawing = false;
  }

  initCanvas();
})();
