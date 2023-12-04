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
  TextField,
  Checkbox,
  Modal,
  IconButton,
  Button,
  Box,
  Typography,
  Drawer,
  FormGroup,
  FormControlLabel,
  TablePagination,
} from '@mui/material';
import { FaPen, FaChevronRight, FaChevronDown, FaChevronUp, FaRegTrashAlt, FaPlusSquare } from 'react-icons/fa';
import { capitalizeFirstLetter } from '../utils/helpers';
import { useState, useRef, useEffect } from 'react';
import Details from './Details';

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { dataData, authedUser } from '../reducers/data';
import { useSelector, useDispatch } from 'react-redux';
import FormPicker from "./FormPicker"
import { removeTableRow, getTableData } from "../utils/api";



const key = 'Table';

function TableView({table}){
  let dispatch = useDispatch();
  const current_user = useSelector(authedUser)
  const list_selector = useSelector(dataData)
  let list = list_selector[table] ? list_selector[table] : []
  
  const list_filt = list.map(dat=>Object.fromEntries(Object.keys(dat).filter(key=>dat[key] && dat[key].constructor !== Array).map(x=> [x, dat[x]])));
  
  const [data, setData] = useState({nodes:list});
  useEffect(()=>{
    dispatch(getTableData(table))
    .then((res)=>{setData({nodes: res.payload.data})})
  }, [dispatch, table])

  //* Theme *//

  const materialTheme = getTheme({
    ...DEFAULT_OPTIONS,
    striped: true,
    highlightOnHover: true,
  });
  
  const customTheme = {
    Table: `
      --data-table-library_grid-template-columns:  repeat(${Object.keys(list_filt[0]).length}, minmax(0, ${100/(Object.keys(list_filt[0]).length)}%));

      margin: 16px 0px;
    `,
    Cell:`
      background-color: none;
    `
  };
  const theme = useTheme([materialTheme, customTheme]);

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
    setData({nodes: list_selector[tableName].filter(row=>row.id!=rowId)})
  }
  
  ////////////Edit
  const [editable, setEditable] = useState(null)
  const handleEditable = (tableName, rowId) =>{
    setEditable(list.filter(row=>row.id == rowId)[0])
    setDrawerId(true)
  }

  //////// Hide Columns
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const toggleColumn = (column) => {
    if (hiddenColumns.includes(column)) {
      setHiddenColumns(hiddenColumns.filter((v) => v !== column));
    } else {
      setHiddenColumns(hiddenColumns.concat(column));
    }
  };

  //* Columns *//

  let COLUMNS = list_filt.length > 0 ? Object.keys(list_filt[0]).map((lab)=> {
    if (lab == "id") {
      return {
        label: 'Id',
        renderCell: (item) => item.id,
        hide: true,
      }
    }
    return {label: capitalizeFirstLetter(lab), renderCell: (item) => item[lab], resize,
      sort: { sortKey: lab.toUpperCase() },  hide: hiddenColumns.includes(capitalizeFirstLetter(lab)), }})
  : []

  if (list.length != 0 && table != "user"){
    COLUMNS.push({
      label: '',
      renderCell: (item) => (
        current_user && item.users.map(usr=>usr.id).includes(current_user.id) && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton onClick={() => handleEditable(table,item.id)}>
            <FaPen size={14} />
          </IconButton>
          {current_user.is_superuser && <IconButton onClick={() => handleRemove(table,item.id)}>
            <FaRegTrashAlt size={14} />
          </IconButton>}
        </div>
      ),
      resize,
    })
  }

  
   //* Search *//
   let search_cols = Object.fromEntries(COLUMNS.filter(col=>col.label!="Id"&& col.label!="").map(col=>[col.label.toLowerCase(),""]))
 
   const [search, setSearch] = useState(search_cols);
 
   useCustom('search', data, {
     state: { search },
     onChange: onSearchChange,
   });
 
   function onSearchChange(action, state) {
     console.log(action, state);
     pagination.fns.onSetPage(0);
   }
 
   //* Custom Modifiers *//
 
   let modifiedNodes = data.nodes;
 
   // search
   modifiedNodes = modifiedNodes.filter((node) =>{
    for (const [key, value] of Object.entries(search)){
      if (value != "" && typeof node[key] == "string"){
        if (!node[key].toLowerCase().includes(value.toLowerCase())){
          return false
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
            width: 500,
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
        {current_user && table != "user" && <Button variant="contained" className='bg-success' onClick={() => setDrawerId(true)} startIcon={<FaPlusSquare />}>
          Add
        </Button>}
        <Button variant="contained" className='bg-light text-dark m-auto me-0' onClick={handleDownloadPdf}>
          Print
        </Button>
      </Stack>
      <Stack spacing={1} direction="row">
        
        {Object.entries(search).filter(([key, value])=>(!hiddenColumns.includes(capitalizeFirstLetter(key)))).map(([key, value])=>(
        <TextField key={`search${key}`} label={<small>{[`${capitalizeFirstLetter(key)}`]}</small>}
        className='me-1'
        size='small'
              defaultValue={value}
              onChange={(event) => setSearch({...search, [key]: event.target.value})}/>))}
        <Button variant="contained" className='m-auto me-0' style={{minWidth:"80px"}} onClick={() => setModalOpened(true)}>
          Columns
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
          <FormPicker table={table} setData={setData} data={editable}/>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Drawer>
    </>
  );
  }


export default TableView


