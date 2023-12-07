export function CheckValidFields(obj) {}

export const invalidStrings = (...strings) => {
  for (let i in strings) {
    let [str] = Object.values(strings[i]);
    if (typeof str !== "string" || str.trim() === "") {
      let [field] = Object.keys(strings[i]);
      throw `Error: ${field} must be a non-empty string`;
    }
  }
};
