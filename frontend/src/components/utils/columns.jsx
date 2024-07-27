import { capitalizeFirstLetter } from "../../utils/helpers";
import { IconButton } from "@mui/material";
import { FaPen, FaRegTrashAlt, FaCheck, FaTimes } from "react-icons/fa";

function col_func(
  data,
  list_options,
  table,
  current_user,
  hiddenColumns,
  resize,
  handleEditable,
  handleRemove
) {
  let columns =
    data.nodes.length > 1
      ? Object.keys(data.nodes[1])
          .filter(
            (lab) =>
              lab.toLowerCase().startsWith("id") ||
              lab.toLowerCase().endsWith("id")
          )
          .map((lab) => {
            return {
              label: capitalizeFirstLetter(lab),
              renderCell: (item) => item[lab],
              sort: { sortKey: lab.toUpperCase() },
              hide: lab == "id" ? true : false,
            };
          })
          .concat(
            Object.keys(data.nodes[1])
              .filter((lab) => lab.toLowerCase().includes("name"))
              .map((lab) => {
                return {
                  label: capitalizeFirstLetter(lab),
                  renderCell: (item) => {
                    if (item.search) {
                      return item[lab];
                    }
                    let field = list_options[table][lab];
                    let val = item[lab];
                    if (field && field.type == "foreign_key") {
                      let name_fields = Object.keys(val).filter((k) =>
                        k.includes("name")
                      );
                      let name_field = name_fields.includes("last_name")
                        ? "last_name"
                        : name_fields.length > 0 && name_fields.slice(0, 1);
                      val = val[name_field];
                      field = list_options[field.name][name_field];
                    }
                    return val;
                  },
                  resize,
                  sort: { sortKey: lab.toUpperCase() },
                  hide: hiddenColumns.includes(capitalizeFirstLetter(lab)),
                };
              })
          )
          .concat(
            Object.keys(data.nodes[1])
              .filter((lab) => lab.toLowerCase().includes("desc"))
              .map((lab) => {
                return {
                  label: capitalizeFirstLetter(lab),
                  renderCell: (item) => item[lab],
                  resize,
                  sort: { sortKey: lab.toUpperCase() },
                  hide: hiddenColumns.includes(capitalizeFirstLetter(lab)),
                };
              })
          )
          .concat(
            Object.keys(data.nodes[1])
              .filter(
                (lab) =>
                  !lab.toLowerCase().startsWith("id") &&
                  !lab.toLowerCase().endsWith("id") &&
                  !lab.toLowerCase().includes("name") &&
                  !lab.toLowerCase().includes("desc") &&
                  lab.toLowerCase() != "users"
              )
              .map((lab) => {
                return {
                  label: capitalizeFirstLetter(lab),
                  renderCell: (item) => {
                    if (item.search) {
                      return item[lab];
                    }
                    let field = list_options[table][lab];
                    let val = item[lab];
                    if (val == null) {
                      return "";
                    }
                    if (field.type == "foreign_key") {
                      while (field.type == "foreign_key") {
                        let name_fields = Object.keys(val).filter((k) =>
                          k.includes("name")
                        );
                        let name_field = name_fields.includes("last_name")
                          ? "last_name"
                          : name_fields.length > 0 && name_fields.slice(0, 1);
                        val = val[name_field];
                        field = list_options[field.name][name_field];
                      }
                    } else if (field.type == "foreign_key_many") {
                      let items = [];
                      val.map((value) => {
                        let v = value;
                        let f = field;
                        do {
                          let name_fields = Object.keys(v).filter((k) =>
                            k.includes("name")
                          );
                          let name_field = name_fields.includes("last_name")
                            ? "last_name"
                            : name_fields.length > 0 && name_fields.slice(0, 1);
                          v = v[name_field];
                          f = list_options[f.name][name_field];
                        } while (f.type == "foreign_key");
                        items.push(v);
                      });
                      val = items.join(", ");
                    } else if (field.type == "boolean") {
                      val = val ? <FaCheck /> : <FaTimes />;
                    } else if (field.type == "file upload") {
                      val = val.split("/").pop();
                    } else if (
                      (lab.toLowerCase().includes("location") ||
                        lab.toLowerCase().includes("url")) &&
                      val.includes("http")
                    ) {
                      val = (
                        <a
                          href={item[lab]}
                          target="_blank"
                          rel="noopener noreferrer">
                          {item[lab]}
                        </a>
                      );
                    }
                    return val;
                  },
                  resize,
                  sort: { sortKey: lab.toUpperCase() },
                  hide: hiddenColumns.includes(capitalizeFirstLetter(lab)),
                };
              })
          )
      : [];

  if (data.nodes.length != 0) {
    columns.push({
      label: "",
      renderCell: (item) => {
        if (item.search) {
          return "";
        }
        const delMsg = `Are you sure you want to delete "${
          item[
            Object.keys(item).find((k) => k.includes("name")) ??
              Object.keys(item).find((k) => k.includes("question")) ??
              Object.keys(item).find((k) => k.includes("id"))
          ]
        }" from "${capitalizeFirstLetter(table)}" table?`;
        return (
          current_user &&
          ((item.users &&
            item.users.map((usr) => usr.id).includes(current_user.id)) ||
            current_user.is_superuser) && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <IconButton onClick={() => handleEditable(table, item.id)}>
                <FaPen size={14} />
              </IconButton>
              {current_user.is_superuser && (
                <IconButton
                  onClick={() =>
                    handleRemove("Confirm Deletion", delMsg, table, item.id)
                  }>
                  <FaRegTrashAlt size={14} />
                </IconButton>
              )}
            </div>
          )
        );
      },
      resize,
      hide: current_user ? false : true,
    });
  }
  return columns;
}

export default col_func;
