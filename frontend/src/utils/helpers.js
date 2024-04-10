// ///////////////////////////////////////////////////////
export function generateUID () {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function truncateText (str) {
  return str.length > 30 ? "..." + str.substring(0, 7) + "..." : "..." + str + "...";
}

export function capitalizeFirstLetter(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}

export function order_dict(dict, options_dict=false){
  let data = Object.entries(dict)
  let ordered_data = data && data.filter(([key, val])=>key.toLowerCase().startsWith("id") || key.toLowerCase().endsWith("id"))
  .concat(data.filter(([key, val])=>key.toLowerCase().includes("name") && key.toLowerCase().includes("last")))
  .concat(data.filter(([key, val])=>key.toLowerCase().includes("name") && key.toLowerCase().includes("first")))
  .concat(data.filter(([key, val])=>key.toLowerCase().includes("name") && !key.toLowerCase().includes("last") && !key.toLowerCase().includes("first")))
  .concat(data.filter(([key, val])=>options_dict ? val.type.includes("email") : false))
  .concat(data.filter(([key, val])=>options_dict ? val.type.includes("password") : false))
  .concat(data.filter(([key, val])=>key.toLowerCase().includes("desc")))
  .concat(data.filter(([key, val])=>key.toLowerCase().includes("question")))
  .concat(data.filter(([key, val])=>key.toLowerCase().includes("answer")))
  .concat(data.filter(([key, val])=>!key.toLowerCase().includes("name") && !key.toLowerCase().startsWith("id") && !key.toLowerCase().endsWith("id") && !key.toLowerCase().includes("desc") && !key.toLowerCase().includes("question") && !key.toLowerCase().includes("answer") && (options_dict ? (!val.type.includes("many") && !val.type.includes("email") && !val.type.includes("password")) : typeof val != "object")))
  .concat(data.filter(([key, val])=>!key.toLowerCase().includes("name") && !key.toLowerCase().startsWith("id") && !key.toLowerCase().endsWith("id") && !key.toLowerCase().includes("desc") && !key.toLowerCase().includes("question") && !key.toLowerCase().includes("answer") && (options_dict ? val.type.includes("many") : typeof val == "object")))

  return ordered_data
}