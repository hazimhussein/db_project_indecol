import { useCustom } from '@table-library/react-table-library/table';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { DEFAULT_OPTIONS, getTheme } from '@table-library/react-table-library/material-ui';
import { useRowSelect } from '@table-library/react-table-library/select';
import { useTree, TreeExpandClickTypes } from '@table-library/react-table-library/tree';
import { useSort } from '@table-library/react-table-library/sort';
import { usePagination } from '@table-library/react-table-library/pagination';
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
} from '@mui/material';
import { FaChevronRight, FaChevronDown, FaChevronUp, FaPlusSquare } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import Details from './Details';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { dataData, authedUser, dataOptions } from '../reducers/data';
import { useSelector, useDispatch } from 'react-redux';
import FormPicker from "./FormPicker"
import { removeTableRow, getTableData } from "../utils/api";
import dayjs from 'dayjs';
import SearchGlob from './elements/search';
import col_func from './utils/columns';
import search_row_builder from './utils/search_row';

const key = 'Table';

function TableView({table}){
  let dispatch = useDispatch();
  const current_user = useSelector(authedUser)
  const list_selector = useSelector(dataData)
  const list_options = useSelector(dataOptions)
  let list = list_selector[table] ? list_selector[table] : []

  //* Search *//
  let search_cols = Object.fromEntries(Object.keys(list_options[table]).filter(col=>col!="id"&& col!="").map(col=>
    col.includes("date")
    ? [col,{start:null, end:null}]
    :[col,""]))
 
   const [search, setSearch] = useState(search_cols);
   let search_row = search_row_builder(search, setSearch)

  
  const [data, setData] = useState({nodes:[search_row].concat(list)});

  useCustom('search', data, {
    state: { search },
    onChange: onSearchChange,
  });

  function onSearchChange(action, state) {
    console.log(action, state);
    pagination.fns.onSetPage(0);
  }
  
  function customSetData(d){
    let n = [search_row].concat(d)
    setData({nodes:n})
  }

  useEffect(()=>{
    let shown_cols = COLUMNS.filter(col => !hiddenColumns.includes(col.label) && col.label!="Id" && col.label!="")
    if (window.innerWidth <= 768 && shown_cols.length >= 3){
      shown_cols = shown_cols.filter(col=>!shown_cols.slice(0,3).map(c=>c.label).includes(col.label)).map(col=>col.label)
        setHiddenColumns(shown_cols)
    } else if (window.innerWidth > 768 && shown_cols.length >= 6){
      shown_cols = shown_cols.filter(col=>!shown_cols.slice(0,6).map(c=>c.label).includes(col.label)).map(col=>col.label)
        setHiddenColumns(shown_cols)
    }
    dispatch(getTableData(table))
    .then((res)=>{customSetData(res.payload.data)})
  }, [dispatch, table])

   //* Resize *//
   const resize = { resizerHighlight: '#dee2e6' };

   //* Pagination *//
   const pagination = usePagination(data, {
     state: {
       page: 0,
       size: 10,
     },
     onChange: onPaginationChange,
   });
 
   function onPaginationChange(action, state) {
     console.log(action, state);
   }
 
   //* Select *//
   const select = useRowSelect(data, {
     onChange: onSelectChange,
   });
 
   function onSelectChange(action, state) {
     console.log(action, state);
   }
 
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
         margin: '4px',
         iconDefault: null,
         iconRight: <FaChevronRight />,
         iconDown: <FaChevronDown />,
       },
     },
   );
 
   function onTreeChange(action, state) {
     console.log(action, state);
   }
 
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
       sortFns: {
        TASK: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
        DEADLINE: (array) => array.sort((a, b) => a.deadline - b.deadline),
        TYPE: (array) => array.sort((a, b) => a.type.localeCompare(b.type)),
        COMPLETE: (array) => array.sort((a, b) => a.isComplete - b.isComplete),
        TASKS: (array) => array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
      },
     },
   );
 
   function onSortChange(action, state) {
     console.log(action, state);
   }
 
   //* Drawer *//
   const [drawerId, setDrawerId] = useState(null);

   const handleCancel = () => {
    setEditable(null)
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
    renderAfterRow: (item) => ((ids.includes(item.id) && list.filter(d=>d.id==item.id)[0]) && (<Details data={data.nodes.filter(d=>d.id==item.id)[0]}/>)),
  };

  ////////////Delete
  const handleRemove = (tableName, rowId) =>{
    dispatch(removeTableRow({table:tableName, rowId:rowId}))
    customSetData(list_selector[tableName].filter(row=>row.id!=rowId))
  }
  
  ////////////Edit
  const [editable, setEditable] = useState(null)
  const handleEditable = (tableName, rowId) =>{
    setEditable(list.filter(row=>row.id == rowId)[0])
    setDrawerId(true)
  }

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
  let COLUMNS = col_func(data, list_options, table, current_user, hiddenColumns, resize, handleEditable, handleRemove)
 
   //* Custom Modifiers *//
   let [modifiedNodes, setModifiedNodes] = useState(data.nodes)
 
 
   // search
   modifiedNodes = modifiedNodes.filter((node) =>{
    if (node.search){
      return true
    }
    for (const [key, value] of Object.entries(search)){
      if (value != "" && typeof node[key] == "string"){
        if (key.toLowerCase().includes("date")) {
            let val = dayjs(node[key])
            if (value.start && val < value.start){
              return false
            }
            if (value.end && val > value.end){
              return false
            }
          } else if (!node[key].toLowerCase().includes(value.toLowerCase())){
            return false
          }
        } else if (typeof node[key] == "object"){
          if (node[key] && node[key].constructor == Array){
            let final_str = ""
              for (const entry of node[key]){
                  for (const [k, v] of Object.entries(entry)){
                      if (v && typeof v == "object"){
                          for (const [key_c, val_c] of Object.entries(v)){
                              if (typeof val_c == "string"){
                                  final_str += val_c
                              }
                          }
                        }
                      else if (typeof v == "string"){
                          final_str += v
                        }
                  }
              }
              if (!final_str.toLowerCase().includes(value.toLowerCase())){
                return false
              }
          } else if (node[key]) {
            let final_str = ""
              for (const [k, v] of Object.entries(node[key])){
                  if (typeof v == "string"){
                      final_str += v
                    }
              }
              if (!final_str.toLowerCase().includes(value.toLowerCase())){
                return false
              }
          }
      }
    }
    return  true
  }
   );

   

   ////////Print
   const printRef = useRef();

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("print.pdf");
  };

  //* Theme *//

  const materialTheme = getTheme({
    ...DEFAULT_OPTIONS,
    striped: true,
    highlightOnHover: true,
  });

  let shown_col_num = COLUMNS.filter((col)=>col.label!="Id" && col.label!="").length 
  - hiddenColumns.length 
  + (current_user ? 1 : 0)
  const customTheme = {
    Table: `
      --data-table-library_grid-template-columns:  repeat(${shown_col_num}, minmax(0, ${100/shown_col_num}%));

      margin: 16px 0px;
    `,
    Cell:`
      background-color: none;
    `
  };
  const theme = useTheme([materialTheme, customTheme]);

   return (
    <>
    <div className='w-100 p-2'></div>
      <Modal open={modalOpened} onClose={() => setModalOpened(false)}>
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            padding: '10px',
          }}
        >
          <Typography variant="h6" component="h2">
            Select the columns you would like to display ...
          </Typography>
          <FormGroup>
            {COLUMNS.filter(col=>col.label!="Id"&& col.label!="").map(col=>col.label).map(col=><FormControlLabel key={col} control={<Checkbox checked={!hiddenColumns.includes(col)}  onChange={() => toggleColumn(col)} />} label={col} />)}
          </FormGroup>
        </Box>
      </Modal>

      {/* Form */}

      <Stack className='py-3' spacing={1} direction="row">
      <Button variant="contained" className='m-auto ms-0 me-1' style={{minWidth:"80px"}} onClick={() => setModalOpened(true)}>
          Columns
        </Button>
        {current_user && table != "user" && <Button variant="contained" className={`bg-success m-auto ${table=="project"? "me-1":"ms-0"}`} onClick={() => setDrawerId(true)} startIcon={<FaPlusSquare />}>
          Add
        </Button>}
        <SearchGlob modifiedNodes={[search_row].concat(list)} setModifiedNodes={setModifiedNodes} />
        <Button variant="contained" className='bg-light text-dark m-auto me-0' onClick={handleDownloadPdf}>
          Print
        </Button>
      </Stack>

      {/* Table */}

      <CompactTable
       ref={printRef}
        key={key}
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
      <Stack spacing={10}>
        <TablePagination
          count={modifiedNodes.length}
          page={pagination.state.page}
          rowsPerPage={pagination.state.size}
          rowsPerPageOptions={[ 2, 5, 10, 20]}
          onRowsPerPageChange={(event) =>
            pagination.fns.onSetSize(parseInt(event.target.value, 10))
          }
          onPageChange={(event, page) => pagination.fns.onSetPage(page)}
        />
      </Stack>

      <Drawer
        open={drawerId}
        onClose={handleCancel}
        title="Edit"
        anchor="right"
        PaperProps={{
          sx: { width: '50%', padding: '20px' },
        }}
      >
        <Stack spacing={1}>
          <FormPicker table={table} setData={customSetData} data={editable} setModifiedNodes={setModifiedNodes}/>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Drawer>
    </>
  );
  }


export default TableView


