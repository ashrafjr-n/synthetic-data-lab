export const generateCSV = (features, rows = 10) => {
  if (!features.length) return "";

  const headers = features.map((f) => f.name);

  const data = [];

  for (let i = 0; i < rows; i++) {
    const row = features.map((f) => {
      if (f.type === "numeric") {
        const min = Number(f.min || 0);
        const max = Number(f.max || 100);

        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      if (f.type === "category" || f.type === "binary") {
        const values = f.values.split(",").map(v => v.trim());
        return values[Math.floor(Math.random() * values.length)];
      }

      return "";
    });

    data.push(row);
  }

  return [
    headers.join(","),
    ...data.map((row) => row.join(","))
  ].join("\n");
};