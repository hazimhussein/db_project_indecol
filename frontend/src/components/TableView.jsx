import { useCustom } from "@table-library/react-table-library/table";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  DEFAULT_OPTIONS,
  getTheme,
} from "@table-library/react-table-library/material-ui";
import { useRowSelect } from "@table-library/react-table-library/select";
import {
  useTree,
  TreeExpandClickTypes,
} from "@table-library/react-table-library/tree";
import { useSort } from "@table-library/react-table-library/sort";
import { usePagination } from "@table-library/react-table-library/pagination";
import {
  Stack,
  Checkbox,
  Modal,
  Button,
  Box,
  Typography,
  Drawer,
  FormGroup,
  FormControlLabel,
  TablePagination,
  TextField,
} from "@mui/material";
import {
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaPlusSquare,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import Details from "./Details";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { dataData, authedUser, dataOptions } from "../reducers/data";
import { useSelector, useDispatch } from "react-redux";
import GeneralForm from "./GeneralForm";
import { removeTableRow, getTableData } from "../utils/api";
import { col_func, search_row_builder, modify_nodes, sort_cols } from "./utils";
import AlertBox from "./elements/AlertBox";

function TableView({ table }) {
  let dispatch = useDispatch();

  const current_user = useSelector(authedUser);
  const list_selector = useSelector(dataData);
  const list_options = useSelector(dataOptions);
  const [dialogOpt, setDialogOpt] = useState(null);
  let list = list_selector[table] ? list_selector[table] : [];

  //* Search *//
  let search_cols = Object.fromEntries(
    Object.keys(list_options[table])
      .filter((col) => col != "id" && col != "")
      .map((col) =>
        col.includes("date") ? [col, { start: null, end: null }] : [col, ""]
      )
  );

  search_cols["global_search"] = "";

  const [search, setSearch] = useState(search_cols);
  let search_row = search_row_builder(search, setSearch, list_options, table);

  //* Table Data *//
  const [data, setData] = useState({ nodes: list });

  useCustom("search", data, {
    state: { search },
    onChange: onSearchChange,
  });

  function customSetData(d) {
    setData({ nodes: d });
    setModifiedNodes(modify_nodes(list_options, table, d, search));
  }

  useEffect(() => {
    dispatch(getTableData(table)).then((res) => {
      customSetData(res.payload.data);
    });
    let shown_cols = COLUMNS.filter(
      (col) =>
        !hiddenColumns.includes(col.label) &&
        col.label != "Id" &&
        col.label != ""
    );
    if (window.innerWidth <= 768 && shown_cols.length >= 3) {
      shown_cols = shown_cols
        .filter(
          (col) =>
            !shown_cols
              .slice(0, 3)
              .map((c) => c.label)
              .includes(col.label)
        )
        .map((col) => col.label);
      setHiddenColumns(shown_cols);
    } else if (window.innerWidth > 768 && shown_cols.length >= 6) {
      shown_cols = shown_cols
        .filter(
          (col) =>
            !shown_cols
              .slice(0, 6)
              .map((c) => c.label)
              .includes(col.label)
        )
        .map((col) => col.label);
      setHiddenColumns(shown_cols);
    }
  }, [dispatch, table]);

  //* Resize *//
  const resize = { resizerHighlight: "#dee2e6" };

  //* Pagination *//
  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: 10,
    },
    onChange: onPaginationChange,
  });

  //* Select *//
  const select = useRowSelect(data, {
    onChange: onSelectChange,
  });

  //* Tree *//
  const tree = useTree(
    data,
    {
      onChange: onTreeChange,
    },
    {
      clickType: TreeExpandClickTypes.ButtonClick,
      treeYLevel: 1,
      treeIcon: {
        margin: "4px",
        iconDefault: null,
        iconRight: <FaChevronRight />,
        iconDown: <FaChevronDown />,
      },
    }
  );

  //* Sort *//
  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortIcon: {
        iconDefault: null,
        iconUp: <FaChevronUp />,
        iconDown: <FaChevronDown />,
      },
      sortFns: sort_cols(list_options, table),
    }
  );

  //* Drawer *//
  const [drawerId, setDrawerId] = useState(null);

  const handleCancel = () => {
    setEditable(null);
    setDrawerId(null);
  };

  //* Modal *//
  const [modalOpened, setModalOpened] = useState(false);

  ////// Expand
  const [ids, setIds] = useState([]);

  const handleExpand = (item) => {
    if (ids.includes(item.id)) {
      setIds(ids.filter((id) => id !== item.id));
    } else {
      setIds(ids.concat(item.id));
    }
  };
  const ROW_PROPS = {
    onClick: handleExpand,
  };

  const ROW_OPTIONS = {
    renderAfterRow: (item) =>
      ids.includes(item.id) &&
      list.filter((d) => d.id == item.id)[0] && (
        <tr className="d-flex w-100" style={{ gridColumn: "1 / -1" }}>
          <td>
            <Details
              data={data.nodes.filter((d) => d.id == item.id)[0]}
              table={table}
            />
          </td>
        </tr>
      ),
  };

  ////////////Delete
  const handleRemove = (tableName, rowId) => {
    dispatch(removeTableRow({ table: tableName, rowId: rowId }));
    customSetData(list_selector[tableName].filter((row) => row.id != rowId));
    setDialogOpt(null)
  };
  const handleRemoveDialog = (title, message, tableName, rowId) => {
    setDialogOpt({
      title: title,
      message: message,
      confirmAction: () => handleRemove(tableName, rowId),
      cancelAction: () => setDialogOpt(null),
    });
  };

  ////////////Edit
  const [editable, setEditable] = useState(null);
  const handleEditable = (tableName, rowId) => {
    setEditable(list.filter((row) => row.id == rowId)[0]);
    setDrawerId(true);
  };

  //////// Hide Columns
  let [hiddenColumns, setHiddenColumns] = useState([]);
  const toggleColumn = (column) => {
    if (hiddenColumns.includes(column)) {
      setHiddenColumns(hiddenColumns.filter((v) => v !== column));
    } else {
      setHiddenColumns(hiddenColumns.concat(column));
    }
  };

  //* Columns *//
  let COLUMNS = col_func(
    data,
    list_options,
    table,
    current_user,
    hiddenColumns,
    resize,
    handleEditable,
    handleRemoveDialog
  );

  //* Filtering according to search *//
  let [modifiedNodes, setModifiedNodes] = useState(data.nodes);
  modifiedNodes = modify_nodes(list_options, table, data.nodes, search);

  ////////Print
  const printRef = useRef();

  const handleDownloadPdf = async () => {
    let jsPdf = new jsPDF({
      orientation: "p",
      unit: "px",
      format: "a4",
      hotfixes: ["px_scaling"],
    });
    const opt = {
      callback: function (jsPdf) {
        jsPdf.save("print.pdf");
      },
      margin: [20, 20, 20, 20],
      autoPaging: "text",
      html2canvas: {
        allowTaint: true,
        letterRendering: true,
        logging: false,
        useCORS: true,
        scale: 0.9,
      },
    };

    jsPdf.html(printRef.current, opt);
  };

  //* Theme *//
  const materialTheme = getTheme({
    ...DEFAULT_OPTIONS,
    striped: true,
    highlightOnHover: true,
  });

  let shown_col_num =
    COLUMNS.filter((col) => col.label != "Id" && col.label != "").length -
    hiddenColumns.filter((c) => c != "").length +
    (current_user && table != "user" ? 1 : 0);

  const customTheme = {
    Table: `
      --data-table-library_grid-template-columns:  repeat(${shown_col_num}, minmax(0, ${
      100 / shown_col_num
    }%));

      margin: 16px 0px;
    `,
    Cell: `
      background-color: none;
    `,
  };
  const theme = useTheme([materialTheme, customTheme]);

  //* Logging Functions *//
  function onSortChange(action, state) {
    console.log(action, state);
  }

  function onSearchChange(action, state) {
    console.log(action, state);
    pagination.fns.onSetPage(0);
  }

  function onPaginationChange(action, state) {
    console.log(action, state);
  }

  function onSelectChange(action, state) {
    console.log(action, state);
  }

  function onTreeChange(action, state) {
    console.log(action, state);
  }

  return (
    <>
      <div className="w-100 p-2"></div>
      {/* Modal for changing visible columns */}
      <Modal
        open={modalOpened ? true : false}
        onClose={() => setModalOpened(false)}>
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
          }}>
          <Typography variant="h6" component="h2">
            Select the columns you would like to display ...
          </Typography>
          <FormGroup>
            {COLUMNS.filter((col) => col.label != "Id" && col.label != "")
              .map((col) => col.label)
              .map((col) => (
                <FormControlLabel
                  key={col}
                  control={
                    <Checkbox
                      checked={!hiddenColumns.includes(col)}
                      onChange={() => toggleColumn(col)}
                    />
                  }
                  label={col}
                />
              ))}
          </FormGroup>
        </Box>
      </Modal>
      {dialogOpt && (
        <AlertBox
          openSignal={dialogOpt ? true : false}
          title={dialogOpt.title}
          message={dialogOpt.message}
          confirmAction={dialogOpt.confirmAction}
          cancelAction={dialogOpt.cancelAction}
        />
      )}

      {/* Global Search and top buttons */}

      <Stack className="py-3" spacing={1} direction="row">
        <Button
          variant="contained"
          className="m-auto ms-0 me-1"
          style={{ minWidth: "80px" }}
          onClick={() => setModalOpened(true)}>
          Columns
        </Button>
        {current_user && (
          <Button
            variant="contained"
            className={`bg-success m-auto ${
              table == "project" ? "me-1" : "ms-0"
            }`}
            onClick={() => setDrawerId(true)}
            startIcon={<FaPlusSquare />}>
            Add
          </Button>
        )}
        <TextField
          label="Search"
          className="w-100 my-3 me-3"
          size="small"
          onChange={(event) =>
            setSearch((prevSearch) => ({
              ...prevSearch,
              global_search: event.target.value,
            }))
          }
        />
        <Button
          variant="contained"
          className="bg-light text-dark m-auto me-0"
          onClick={handleDownloadPdf}>
          Print
        </Button>
      </Stack>

      {/* Table */}

      {/* Specific Search Row */}
      <CompactTable
        key="Search"
        columns={COLUMNS.map((c) =>
          Object.fromEntries(Object.entries(c).filter(([k, v]) => k != "label"))
        )}
        data={{ nodes: [search_row] }}
        theme={theme}
        layout={{ custom: true }}
      />
      {/* Main Table */}
      <CompactTable
        ref={printRef}
        key="Table"
        columns={COLUMNS}
        data={{ ...data, nodes: modifiedNodes }}
        theme={theme}
        layout={{ custom: true }}
        select={select}
        tree={tree}
        sort={sort}
        pagination={pagination}
        rowProps={ROW_PROPS}
        rowOptions={ROW_OPTIONS}
      />

      <br />

      {/* Switching Pages area */}
      <Stack spacing={10}>
        <table>
          <tbody>
            <tr>
              <TablePagination
                count={modifiedNodes.length}
                page={pagination.state.page}
                rowsPerPage={pagination.state.size}
                rowsPerPageOptions={[5, 10, 20, 50]}
                onRowsPerPageChange={(event) =>
                  pagination.fns.onSetSize(parseInt(event.target.value, 10))
                }
                onPageChange={(event, page) => pagination.fns.onSetPage(page)}
              />
            </tr>
          </tbody>
        </table>
      </Stack>

      {/* Side Form */}
      <Drawer
        open={drawerId ? true : false}
        onClose={handleCancel}
        title="Edit"
        anchor="right"
        PaperProps={{
          sx: { width: "50%", padding: "20px" },
        }}>
        <Stack spacing={1}>
          <GeneralForm table={table} setData={customSetData} data={editable} />
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}

export default TableView;
