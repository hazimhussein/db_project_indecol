import dayjs from "dayjs";

function modify_nodes(list_options, table, nodes, search) {
  let global_val = search["global_search"];
  let filtered_nodes =
    global_val == ""
      ? nodes
      : nodes.filter((node) => {
          if (node.search) {
            return true;
          }
          for (const [key, value] of Object.entries(node)) {
            if (value == null || value == []) {
              continue;
            }
            let type = list_options[table][key].type;
            if (type == "string" || type == "email") {
              if (value.toLowerCase().includes(global_val.toLowerCase())) {
                return true;
              }
            } else if (type == "foreign_key_many") {
              let final_str = "";
              for (const entry of value) {
                let name_fields = Object.keys(
                  list_options[list_options[table][key].name]
                ).filter((col) => col.includes("name"));
                if (name_fields.length > 0) {
                  let name_field = name_fields.includes("last_name")
                    ? "last_name"
                    : name_fields.slice(0, 1);
                  final_str += entry[name_field];
                }
              }

              if (final_str.toLowerCase().includes(global_val.toLowerCase())) {
                return true;
              }
            } else if (type == "foreign_key") {
              let name_fields = Object.keys(
                list_options[list_options[table][key].name]
              ).filter((col) => col.includes("name"));
              if (name_fields.length > 0) {
                let name_field = name_fields.includes("last_name")
                  ? "last_name"
                  : name_fields.slice(0, 1);
                if (
                  value &&
                  value[name_field]
                    .toLowerCase()
                    .includes(global_val.toLowerCase())
                ) {
                  return true;
                }
              }
            }
          }
          return false;
        });

  return filtered_nodes.filter((node) => {
    if (node.search) {
      return true;
    }
    for (const [key, value] of Object.entries(search).filter(
      ([k, v]) => k != "global_search"
    )) {
      let type = list_options[table][key].type;
      if (
        value != "" &&
        type != "date" &&
        (node[key] == null || node[key] == [])
      ) {
        return false;
      } else if (value != "" && type == "date") {
        let val = dayjs(node[key]);
        if (value.start && val < value.start) {
          return false;
        }
        if (value.end && val > value.end) {
          return false;
        }
      } else if (value != "" && (type == "string" || type == "email")) {
        if (!node[key].toLowerCase().includes(value.toLowerCase())) {
          return false;
        }
      } else if (value && value != "" && type == "foreign_key_many") {
        let final_str = "";
        for (const entry of node[key]) {
          let name_fields = Object.keys(
            list_options[list_options[table][key].name]
          ).filter((col) => col.includes("name"));
          if (name_fields.length > 0) {
            let name_field = name_fields.includes("last_name")
              ? "last_name"
              : name_fields.slice(0, 1);
            final_str += entry[name_field];
          }
        }

        if (!final_str.toLowerCase().includes(value.toLowerCase())) {
          return false;
        }
      } else if (type == "foreign_key") {
        let name_fields = Object.keys(
          list_options[list_options[table][key].name]
        ).filter((col) => col.includes("name"));
        if (name_fields.length > 0) {
          let name_field = name_fields.includes("last_name")
            ? "last_name"
            : name_fields.slice(0, 1);
          if (
            node[key] &&
            !node[key][name_field].toLowerCase().includes(value.toLowerCase())
          ) {
            return false;
          }
        }
      }
    }
    return true;
  });
}

export default modify_nodes;
