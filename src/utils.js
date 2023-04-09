function distance(x, y, collX, collY) {
  return Math.sqrt(
    Math.pow(Math.abs(collX - x), 2) + Math.pow(Math.abs(collY - y), 2)
  );
}

function createDrops() {
  var drops = [];
  const numberOfDrops = Math.floor(canvas.width / 8);
  for (let i = 0; i < numberOfDrops; i++) {
    const opacity = Math.random();
    const drop = {
      color: `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 50)}, ${opacity})`,
      speed: Math.floor(Math.random() * 2) + 1,
      fontSize: Math.floor(Math.random() * 80) + 1,
      text: String.fromCharCode(Math.floor(Math.random() * 96) + 32),
      y: Math.floor(Math.random() * canvas.height),
      x: Math.floor(Math.random() * canvas.width),
    };
    drops[i] = drop;
  }

  return drops;
}

export { distance, createDrops };
