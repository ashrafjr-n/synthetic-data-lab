export const downloadCSV = (csv, datasetName = "dataset") => {
  const blob = new Blob([csv], { type: "text/csv" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${datasetName}.csv`;
  a.click();

  URL.revokeObjectURL(url);
};