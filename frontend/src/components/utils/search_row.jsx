import { capitalizeFirstLetter } from "../../utils/helpers";
import { DatePicker } from "@mui/x-date-pickers";
import { TextField, Switch } from "@mui/material";

function search_row_builder(search, setSearch, list_options, table) {
  let row = { id: "search", search: true };
  Object.entries(search)
    .filter(([k, v]) => k != "global_search")
    .map(([key, value]) => {
      let type = list_options[table][key].type;
      type == "date"
        ? (row[key] = (
            <div key={`search${key}`} className="d-flex flex-column mb-1">
              <h6 className="small">Search range...</h6>
              <DatePicker
                label={<small>{[`Start ${capitalizeFirstLetter(key)}`]}</small>}
                format="YYYY-MM-DD"
                inputFormat="YYYY-MM-DD"
                onChange={(e) =>
                  setSearch((prevSearch) => ({
                    ...prevSearch,
                    [key]: { start: e, end: prevSearch[key].end },
                  }))
                }
                id={key}
                size="small"
                className="mb-2 mt-1"
                style={{ height: "50px" }}
                slotProps={{ textField: { size: "small" } }}
              >
                {value.start && value.start.format("YYYY-MM-DD")}
              </DatePicker>
              <DatePicker
                label={<small>{[`End ${capitalizeFirstLetter(key)}`]}</small>}
                format="YYYY-MM-DD"
                inputFormat="YYYY-MM-DD"
                onChange={(e) =>
                  setSearch((prevSearch) => ({
                    ...prevSearch,
                    [key]: { start: prevSearch[key].start, end: e },
                  }))
                }
                id={key}
                slotProps={{ textField: { size: "small" } }}
              >
                {value.end && value.end.format("YYYY-MM-DD")}
              </DatePicker>
            </div>
          ))
        : type == "boolean"
        ? (row[key] = (
            <Switch
              onChange={(event) =>
                setSearch((prevSearch) => ({
                  ...prevSearch,
                  [key]: event.target.checked,
                }))
              }
            />
          ))
        : (type == "string" ||
            type == "email" ||
            type == "foreign_key" ||
            type == "foreign_key_many") &&
          (row[key] = (
            <TextField
              key={`search${key}`}
              label={<small>{[`${capitalizeFirstLetter(key)}`]}</small>}
              size="small"
              defaultValue={value}
              onChange={(event) =>
                setSearch((prevSearch) => ({
                  ...prevSearch,
                  [key]: event.target.value,
                }))
              }
            />
          ));
    });
  return row;
}

export default search_row_builder;
