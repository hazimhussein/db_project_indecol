import {
  TextField,
  Button,
  FormControl,
  Modal,
  Box,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { addTableRow, updateTableRow } from "../utils/api";
import { useSelector } from "react-redux";
import { dataData, authedUser, dataOptions } from "../reducers/data";
import { useState } from "react";
import dayjs from "dayjs";
import SelectSearch from "./elements/selectSearch";
import { capitalizeFirstLetter, order_dict } from "../utils/helpers";
import InputFileUpload from "./elements/FileUpload";
import PasswordInput from "./elements/PasswordInput";

import { DatePicker } from "@mui/x-date-pickers";

function GeneralForm({
  setData,
  data,
  table,
  child,
  parentOptions,
  setParentOptions,
  parentField,
}) {
  let dispatch = useDispatch();

  let list = useSelector(dataData);
  const current_user = useSelector(authedUser);
  let list_options = useSelector(dataOptions)[table];

  let options_dict = {};

  Object.entries(list_options)
    .filter(([key, val]) => key != "id")
    .map(
      ([key, val]) =>
        (options_dict[key] =
          data && data[key]
            ? key.includes("date")
              ? dayjs(data[key])
              : val.type.includes("many")
              ? data[key].map((v) => v.id)
              : val.type.includes("foreign_key")
              ? data[key].id
              : data[key]
            : val.type.includes("many")
            ? []
            : undefined)
    );

  const [options, setOptions] = useState(options_dict);

  let invalid_dict = Object.fromEntries(
    Object.keys(list_options)
      .filter((k) => k != "id")
      .map((k) => [k, false])
  );

  const [invalid, setInvalid] = useState(invalid_dict);
  const [formState, setFormState] = useState("");

  const handleSave = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let userIds = [];

    if (options.users) {
      userIds = [...options.users];
      if (~userIds.includes(current_user.id)) {
        userIds.push(current_user.id);
      }
    }

    let entry = {};

    Object.entries(options).map(
      ([key, val]) =>
        (entry[key] =
          key.includes("date") && val
            ? dayjs(val).format("YYYY-MM-DD")
            : key == "users"
            ? Array.from(new Set(userIds))
            : val)
    );

    let param = { table: table, row: entry };

    if (data == null || child) {
      dispatch(addTableRow(param)).then((res) => {
        if (res.error) {
          if (
            typeof res.payload == "string" &&
            res.payload.includes("<title>")
          ) {
            setFormState(res.payload.split("<title>")[1].split("</title>")[0]);
          } else {
            Object.keys(invalid).map((key) => {
              if (Object.keys(res.payload).includes(key)) {
                setInvalid((prev) => ({ ...prev, [key]: res.payload[key] }));
              } else {
                setInvalid((prev) => ({ ...prev, [key]: false }));
              }
            });
            setFormState("fail");
          }
        } else {
          Object.keys(invalid).map((key) => {
            setInvalid((prev) => ({ ...prev, [key]: false }));
          });
          setFormState("success");
          if (!child) {
            setData([...list[table], res.payload.data]);
          } else {
            setParentOptions({
              ...parentOptions,
              [parentField.name]: parentField.list
                ? parentOptions[parentField.name].concat([res.payload.data.id])
                : res.payload.data.id,
            });
          }
        }
      });
    } else {
      dispatch(
        updateTableRow({ table: table, row: entry, rowId: data.id })
      ).then((res) => {
        if (res.error) {
          if (
            typeof res.payload == "string" &&
            res.payload.includes("<title>")
          ) {
            setFormState(res.payload.split("<title>")[1].split("</title>")[0]);
          } else {
            Object.keys(invalid).map((key) => {
              if (Object.keys(res.payload).includes(key)) {
                setInvalid((prev) => ({ ...prev, [key]: res.payload[key] }));
              } else {
                setInvalid((prev) => ({ ...prev, [key]: false }));
              }
            });
            setFormState("fail");
          }
        } else {
          Object.keys(invalid).map((key) => {
            setInvalid((prev) => ({ ...prev, [key]: false }));
          });
          setFormState("success");
          setData(res.payload.data);
        }
      });
    }
  };

  // Modal
  const defaultModal = {
    table: false,
    field: { name: "", list: false },
    data: null,
  };
  const [modalOpened, setModalOpened] = useState(defaultModal);

  return (
    <div
      className="d-flex flex-column"
      tabIndex="0"
      onKeyDown={(e) => e.key === "Enter" && handleSave(e)}
    >
      <Modal
        open={modalOpened.table ? true : false}
        onClose={() => setModalOpened(defaultModal)}
      >
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            padding: "10px",
            height: "90%",
          }}
          className="d-flex flex-column"
        >
          <Typography variant="h6" component="h2">
            Add a new {modalOpened.table} record ...
          </Typography>
          <GeneralForm
            setData={setData}
            data={modalOpened.data}
            child={true}
            table={modalOpened.table}
            parentOptions={options}
            setParentOptions={setOptions}
            parentField={modalOpened.field}
          />
          <Button
            variant="outlined"
            onClick={() => setModalOpened(defaultModal)}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
      {order_dict(list_options, (options_dict = true))
        .filter(([key, val]) => key != "id")
        .map(([key, val]) => {
          if (val.type == "password") {
            return (
              <FormControl key={key}>
                <PasswordInput
                  className="my-2"
                  label={val.label}
                  handlePassword={(e) =>
                    setOptions({ ...options, [key]: e.target.value })
                  }
                  required={val.required}
                  error={invalid[key] && true}
                />
                {invalid[key] && (
                  <p
                    className={`text-danger small m-0 mb-2`}
                    style={{ textAlign: "left" }}
                  >
                    {invalid[key]}
                  </p>
                )}
              </FormControl>
            );
          } else if (
            key.toLowerCase().includes("desc") ||
            (val.type == "string" && val.max_length > 200)
          ) {
            return (
              <FormControl key={key}>
                <Form.Label htmlFor={key}>{val.label}</Form.Label>
                <textarea
                  id={key}
                  className={`form-control px-3 ${
                    invalid.description && "border-danger"
                  }`}
                  name={key}
                  minLength={10}
                  defaultValue={data && data[key]}
                  placeholder={data && data[key]}
                  onChange={(e) =>
                    setOptions({ ...options, [key]: e.target.value })
                  }
                />
                {invalid[key] && (
                  <p
                    className={`text-danger small m-0 mb-2`}
                    style={{ textAlign: "left" }}
                  >
                    {invalid[key]}
                  </p>
                )}
              </FormControl>
            );
          } else if (
            val.type == "string" ||
            val.type == "integer" ||
            val.type == "email"
          ) {
            return (
              <FormControl key={key}>
                <TextField
                  label={val.label}
                  id={key}
                  className="my-2"
                  defaultValue={data && data[key]}
                  onChange={(e) =>
                    setOptions({ ...options, [key]: e.target.value })
                  }
                  required={val.required}
                  error={invalid[key] && true}
                />
                {invalid[key] && (
                  <p
                    className={`text-danger small m-0 mb-2`}
                    style={{ textAlign: "left" }}
                  >
                    {invalid[key]}
                  </p>
                )}
              </FormControl>
            );
          } else if (val.type == "date") {
            return (
              <FormControl key={key}>
                <DatePicker
                  label={`${val.label} ${val.required ? "*" : ""}`}
                  format="YYYY-MM-DD"
                  inputFormat="YYYY-MM-DD"
                  value={options[key]}
                  minDate={key.includes("end") ? options.start_date : undefined}
                  onChange={(e) => setOptions({ ...options, [key]: e })}
                  id={key}
                  className={`my-2`}
                  error={invalid[key] && true}
                >
                  {data && data[key]}
                </DatePicker>
                {invalid[key] && (
                  <p
                    className={`text-danger small m-0 mb-2`}
                    style={{ textAlign: "left" }}
                  >
                    {invalid[key]}
                  </p>
                )}
              </FormControl>
            );
          } else if (val.type == "boolean") {
            return (
              <FormControl key={key} className="align-items-start">
                <FormControlLabel
                  label={val.label}
                  labelPlacement="start"
                  control={
                    <Switch
                      checked={options[key] ? options[key] : false}
                      onChange={(e) => {
                        setOptions({ ...options, [key]: e.target.checked });
                      }}
                    />
                  }
                  required={val.required}
                />
                {invalid[key] && (
                  <p
                    className={`text-danger small m-0 mb-2`}
                    style={{ textAlign: "left" }}
                  >
                    {invalid[key]}
                  </p>
                )}
              </FormControl>
            );
          } else if (val.type == "file upload") {
            return (
              <FormControl key={key} className="align-items-center">
                <FormControlLabel
                  label={val.label}
                  labelPlacement="top"
                  control={
                    <InputFileUpload
                      options={options}
                      setOptions={setOptions}
                      field={key}
                      className="d-block mt-5"
                    />
                  }
                  required={val.required}
                />
                {invalid[key] && (
                  <p
                    className={`text-danger small m-0 mb-2`}
                    style={{ textAlign: "left" }}
                  >
                    {invalid[key]}
                  </p>
                )}
              </FormControl>
            );
          } else if (val.type.includes("foreign_key")) {
            return (
              <FormControl key={key}>
                <SelectSearch
                  table={table}
                  field={{ key: key, val: val }}
                  admin={
                    current_user && current_user.is_superuser ? true : false
                  }
                  tables={list["category"]}
                  options={options}
                  setOptions={setOptions}
                  data={list[val.name].filter((v) =>
                    val.name == "fieldoption"
                      ? v.table.name.toLowerCase() == table && v.field == key
                      : val.name == "user"
                      ? v.id != current_user.id
                      : val.name == table
                      ? data
                        ? v.id != data.id
                        : true
                      : true
                  )}
                  setModalOpened={setModalOpened}
                  error={invalid[key] && true}
                />
                {invalid[key] && (
                  <p
                    className={`text-danger small m-0 mb-2`}
                    style={{ textAlign: "left" }}
                  >
                    {invalid.keywords}
                  </p>
                )}
                <Form.Text muted>
                  {val.name == "user"
                    ? "Add other people who you would like to be able to edit this entry"
                    : val.name == "person" &&
                      `Add people who are part of this ${capitalizeFirstLetter(
                        table
                      )}`}
                </Form.Text>
              </FormControl>
            );
          }
        })}
      <Button className="mt-5" variant="contained" onClick={handleSave}>
        Save
      </Button>
      {formState != "" && (
        <p
          className={`${
            formState == "success" ? "text-success" : "text-danger"
          } small`}
          style={{ textAlign: "left" }}
        >
          {formState == "fail"
            ? `${
                data == null ? "Adding" : "Updating"
              } record failed, please confirm your inputs are in correct format and you have filled all required fields`
            : formState == "success"
            ? `${data == null ? "Adding" : "Updating"} record succeeded`
            : `${
                data == null ? "Adding" : "Updating"
              } record failed, ${formState}`}
        </p>
      )}
    </div>
  );
}

export default GeneralForm;
