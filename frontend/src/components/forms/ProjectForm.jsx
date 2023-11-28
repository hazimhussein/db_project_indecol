import { TextField, Button, MenuItem, FormControl, InputLabel, OutlinedInput, Select, Modal, Box, Typography, FormGroup, ListSubheader  } from "@mui/material"
import { useTheme } from '@mui/material/styles';
import TextArea from "./TextArea"
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { addTableRow, updateTableRow, getTableData } from "../../utils/api";
import { useSelector } from 'react-redux';
import { dataData, authedUser } from '../../reducers/data';
import { useState } from "react";
import { Col } from "react-bootstrap";
import { Option, MultiSelect } from "./Select";
import dayjs from 'dayjs';
import { FaPlusSquare } from 'react-icons/fa';
import PersonForm from "./PersonForm";
import GroupForm from "./GroupForm";
import ResourceForm from "./ResourceForm";
import PartnerForm from "./PartnerForm";


import {DatePicker} from "@mui/x-date-pickers"

const keywords_list = [
    ['circular economy','CIRCULAR ECONOMY'],
    ['resources','RESOURCES'],
    ['materials', 'MATERIALS'],
    ['recycling', 'RECYCLING'],
    ['environment', 'ENVIRONMENT'],  
    ['ecosystems','ECOSYSTEMS'],
    ['bioresources','BIORESOURCES'],
    ['biodiversity', 'BIODIVERSITY'],
    ['climate', 'CLIMATE'],
    ['bioenergy', 'BIOENERGY'],  
    ['food','FOOD'],
    ['biomaterials','BIOMATERIALS'],
    ['energy', 'ENERGY'],
    ['transport', 'TRANSPORT'],
    ['buildings', 'BUILDINGS'],  
    ['pollution','POLLUTION'],
    ['transformation pathways','TRANSFORMATION PATHWAYS'],
    ['human settlement', 'HUMAN SETTLEMENT'],
    ['Sustainable Production','SUSTAINABLE PRODUCTION' ],
    ['Consumption','CONSUMPTION'],  
    ['Production','PRODUCTION'],
    ['trade','TRADE'],
    ['economic growth','ECONOMIC GROWTH'],
    ['sustainability', 'SUSTAINABILITY'],
    ['exiobase', 'EXIOBASE'],
    ['database', 'DATABASE']]

const methods_list =[
    ['lca','Life Cycle Assessment'],
    ['eemrio','Environmentally Extended Multi-Regional Input-Output analysis'],
    ['ia', 'Impact Assessment'],
    ['mfa', 'Material Flow Analysis'],
    ['sqlite','Sqlite']
]

const type_list = [
    ['Master Project','Master Project'],
    ['PhD Project','PhD Project'],
    ['PostDoc Project','PostDoc Project'],
    ['Other type', 'Other type'],
    ['European Project','European Project']
]

function getStyles(name, userId, theme) {
    return {
      fontWeight:
        userId.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    autoFocus:false,
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  
function ProjectForm({setData, data}){
    let dispatch = useDispatch();
    const theme = useTheme();
    const [keyword, setKeyword] = useState(data?data.keywords.split(", "):[]);
    const [method, setMethod] = useState(data?data.methods.split(", "):[]);
    const [personId, setPersonsId] = useState(data?data.persons.map(person=>person.id):[]);
    const [groupId, setGroupsId] = useState(data?data.groups.map(group=>group.id):[]);
    const [partnerId, setPartnersId] = useState(data && data.partners?data.partners.map(partner=>partner.id):[]);
    const [resourceId, setResourcesId] = useState(data && data.resources?data.resources.map(resource=>resource.id):[]);
    const [projectId, setProjectsId] = useState(data && data.projects ?data.projects.map(project=>project.id):[]);
    const [userId, setUsersId] = useState(data?data.users.map(user=>user.id):[]);
    const [type, setType] = useState(data?data.type:"Master Project");
    const [startDate, setStartDate] = useState(data?dayjs(data.start_date):"");
    const [endDate, setEndDate] = useState(data?dayjs(data.end_date):"");

    //Filter
    let filter_dict = {user:"", keyword:"", method:"", type:"", person:"", group:"", partner:"", resource:"", project:""}
    const [filter, setFilter] = useState(filter_dict)

    let options_dict = {user:[], keyword:[], method:[], type:[], person:[], group:[], partner:[], resource:[], project:[]}
    const [options, setOptions] = useState(options_dict)

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        console.log(event)
        if(event.target.name == "type"){
            setType(value)
        } else if(event.target.name == "keywords"){
            setKeyword(value.join(", "))
        } else if(event.target.name == "method"){
            setMethod(value.join(", "))
        } 
        
        let val = typeof value === 'string' ? value.split(',') : value

        if(event.target.name == "persons"){
            setPersonsId(val)
        } else if(event.target.name == "partners"){
            setPartnersId(val)
        } else if(event.target.name == "resources"){
            setResourcesId(val)
        } else if(event.target.name == "groups"){
            setGroupsId(val)
        } else if(event.target.name == "projects"){
            setProjectsId(val)
        } else if (event.target.name == "users"){
            setUsersId(val)
        }
    }; 

    let list = useSelector(dataData)
    let users = list["user"] ? list["user"] : []
    let persons = list["person"] ? list["person"] : []
    let partners = list["partner"] ? list["partner"] : []
    let groups = list["group"] ? list["group"] : []
    let resources = list["resource"] ? list["resource"] : []
    let projects = list["project"] ? list["project"] : []
    const current_user = useSelector(authedUser)

    const handleSave = () => {
        let cols = ["project_id", "name", "description"]
        let userIds = [...userId]
        if (~userIds.includes(current_user.id)){
          userIds.push(current_user.id)
        }
        
        let entry = {}
        for (let col of cols){
            entry[col] = document.getElementById(col).value
        }
        entry["start_date"] = `${startDate.$y}-${startDate.$M}-${startDate.$D}`
        entry["end_date"] = `${endDate.$y}-${endDate.$M}-${endDate.$D}`
        entry["type"] = type
        entry["keywords"] = typeof keyword != "string" ? keyword.join(", ") : keyword
        entry["methods"] = typeof method != "string" ? method.join(", ") : method
        entry["persons"] = personId
        entry["partners"] = partnerId
        entry["groups"] = groupId
        entry["resources"] = resourceId
        entry["projects"] = projectId
        entry["users"] = userIds
        let param = {table:"project", row: entry}
        
        if (data == null){
            dispatch(addTableRow(param))
            .then((res)=>{
                console.log(res)
                setData({nodes: [...list["project"], res.payload.data]})})
           
        } else {
            dispatch(updateTableRow({table:"project", row: entry, rowId: data.id}))
            .then((res)=>{setData({nodes: [...list["project"].filter(row=>row.id!=data.id), res.payload.data]});
            })

            
        }
      };



      // Modal
      const [modalOpened, setModalOpened] = useState(false);

    return (
        <>
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
          className="d-flex flex-column"
        >
          {modalOpened == "person"?
            <>
            <Typography variant="h6" component="h2">
              Add a new person record ...
            </Typography>
            <PersonForm setData={setData} child={true}/>
            </>
            : modalOpened == "group"?
            <>
            <Typography variant="h6" component="h2">
              Add a new group record ...
            </Typography>
            <GroupForm setData={setData} child={true}/>
            </>
            : modalOpened == "resource"?
            <>
            <Typography variant="h6" component="h2">
              Add a new person record ...
            </Typography>
            <ResourceForm setData={setData} child={true}/>
            </>
            : modalOpened == "partner" &&
            <>
            <Typography variant="h6" component="h2">
              Add a new person record ...
            </Typography>
            <PartnerForm setData={setData} child={true}/>
            </>}
            <Button variant="outlined" onClick={()=>setModalOpened(false)}>
            Cancel
          </Button>
        </Box>
      </Modal>
        <TextField
            label="Project ID"
            id="project_id"
            className='my-2'
            defaultValue={data && data.project_id}
            autoFocus
            required
          />
        <TextField
            label="Full Name"
            id="name"
            className='my-2'
            defaultValue={data && data.name}
            required
          />
          <Form.Label htmlFor="description">Description</Form.Label>
          <textarea id="description" 
          className="form-control px-3" 
          name="description" 
          minLength={10} 
          defaultValue={data && data.description} placeholder={data && data.description}/>

          <DatePicker 
          label="Start Date"
          format="YYYY-MM-DD"
          inputFormat="YYYY-MM-DD"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)} 
          id="start_date" 
          className="my-2">
            {data && data.start_date}
            </DatePicker>
            <DatePicker 
          label="End Date"
          format="YYYY-MM-DD"
          inputFormat="YYYY-MM-DD"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)} 
          id="end_date" 
          className="my-2">
            {data && data.end_date}
            </DatePicker>
          
        <FormControl className="py-2 w-100">
        <InputLabel id="keywordsLabel">Keywords</InputLabel>
        <Select
          labelId="keywordsLabel"
          id="keywords"
          name="keywords"
          multiple
          defaultValue={keyword}
          onChange={handleChange}
          input={<OutlinedInput label="Keywords" />}
          MenuProps={MenuProps}
        >
            {keywords_list.map(keyword=><MenuItem key={keyword[0]} value={keyword[0]}>{keyword[1]}</MenuItem>)}
            
        </Select>
      </FormControl>
        <FormControl className="py-2 w-100">
        <InputLabel id="methodsLabel">Methods</InputLabel>
        <Select
          labelId="methodsLabel"
          id="method"
          name="method"
          multiple
          defaultValue={method}
          onChange={handleChange}
          input={<OutlinedInput label="Methods" />}
          MenuProps={MenuProps}
        >
        {methods_list.map(keyword=><MenuItem key={keyword[0]} value={keyword[0]}>{keyword[1]}</MenuItem>)}
        
        </Select>
      </FormControl>
        <FormControl className="py-2 w-100">
        <InputLabel id="typeLabel">Type</InputLabel>
        <Select
          labelId="typeLabel"
          id="type"
          name="type"
          defaultValue={type}
          onChange={handleChange}
          input={<OutlinedInput label="Type" />}
          MenuProps={MenuProps}
        >
        {type_list.map(keyword=><MenuItem key={keyword[0]} value={keyword[0]}>{keyword[1]}</MenuItem>)}
        
        </Select>
      </FormControl>
      <FormControl className="py-2 w-100">
        <Form.Group>
        <InputLabel id="personsLabel">Persons</InputLabel>
        <Select
          labelId="personsLabel"
          id="persons"
          name="persons"
          style={{width:"85%"}}
          multiple
          defaultValue={personId}
          onChange={handleChange}
          input={<OutlinedInput label="Persons" />}
          MenuProps={MenuProps}
        >
          {persons.map((person) => (
            <MenuItem
              key={person.id}
              value={person.id}
              style={getStyles(person.id, personId, theme)}
            >
              {`${person.first_name} ${person.last_name}`}
            </MenuItem>
          ))}
        </Select>
        <button className="h1 btn-success d-inline-flex align-items-end position-absolute rounded m-0 mt-1 ms-4"
        onClick={()=>setModalOpened("person")}><FaPlusSquare /></button>
        </Form.Group>
        <Form.Text muted>
        Add people who are part of this Project
      </Form.Text>
      </FormControl>
      <FormControl className="py-2 w-100">
      <Form.Group>
        <InputLabel id="groupsLabel">Groups</InputLabel>
        <Select
          labelId="groupsLabel"
          id="groups"
          name="groups"
          style={{width:"85%"}}
          multiple
          defaultValue={groupId}
          onChange={handleChange}
          input={<OutlinedInput label="Groups" />}
          MenuProps={MenuProps}
        >
          {groups.map((group) => (
            <MenuItem
              key={group.id}
              value={group.id}
              style={getStyles(group.id, groupId, theme)}
            >
              {`${group.name}`}
            </MenuItem>
          ))}
        </Select>
        <button className="h1 btn-success d-inline-flex align-items-end position-absolute rounded m-0 mt-1 ms-4"
        onClick={()=>setModalOpened("group")}><FaPlusSquare /></button>
        </Form.Group>
      </FormControl>
      <FormControl className="py-2 w-100">
      <Form.Group>
        <InputLabel id="partnersLabel">Partners</InputLabel>
        <Select
          labelId="partnersLabel"
          id="partners"
          name="partners"
          style={{width:"85%"}}
          multiple
          defaultValue={partnerId}
          onChange={handleChange}
          input={<OutlinedInput label="Partners" />}
          MenuProps={MenuProps}
        >
          {partners.map((partner) => (
            <MenuItem
              key={partner.id}
              value={partner.id}
              style={getStyles(partner.id, partnerId, theme)}
            >
              {`${partner.name}`}
            </MenuItem>
          ))}
        </Select>
        <button className="h1 btn-success d-inline-flex align-items-end position-absolute rounded m-0 mt-1 ms-4"
        onClick={()=>setModalOpened("partner")}><FaPlusSquare /></button>
        </Form.Group>
      </FormControl>
      <FormControl className="py-2 w-100">
      <Form.Group>
        <InputLabel id="resourcesLabel">Resources</InputLabel>
        <Select
          labelId="resourcesLabel"
          id="resources"
          name="resources"
          style={{width:"85%"}}
          multiple
          defaultValue={resourceId}
          onChange={handleChange}
          input={<OutlinedInput label="Resources" />}
          MenuProps={MenuProps}
        >
          {resources.map((resource) => (
            <MenuItem
              key={resource.id}
              value={resource.id}
              style={getStyles(resource.id, resourceId, theme)}
            >
              {`${resource.full_name}`}
            </MenuItem>
          ))}
        </Select>
        <button className="h1 btn-success d-inline-flex align-items-end position-absolute rounded m-0 mt-1 ms-4"
        onClick={()=>setModalOpened("resource")}><FaPlusSquare /></button>
        </Form.Group>
      </FormControl>
      <FormControl className="py-2 w-100">
        <InputLabel id="projectsLabel">Master Projects</InputLabel>
        <Select
          labelId="projectsLabel"
          id="projects"
          name="projects"
          multiple
          defaultValue={projectId}
          onChange={handleChange}
          input={<OutlinedInput label="Master Projects" />}
          MenuProps={MenuProps}
        >
          {projects.map((project) => (
            <MenuItem
              key={project.id}
              value={project.id}
              style={getStyles(project.id, projectId, theme)}
            >
              {`${project.project_id}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

        <FormControl className="py-2 w-100">
        <InputLabel id="usersLabel">Users</InputLabel>
        <Select
          labelId="usersLabel"
          id="users"
          name="users"
          multiple
          defaultValue={userId}
          onChange={handleChange}
          input={<OutlinedInput label="Users" />}
          MenuProps={MenuProps}
        >
          <ListSubheader> 
              <TextField
              size="small"
              autoFocus
              placeholder="Search"
              fullWidth
              defaultValue={filter.user}
              onChange={(event) => setFilter({...filter, user: event.target.value})}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation();
                }
              }}
          /></ListSubheader>
          {users.filter(user=>user.id!=current_user.id && (`${user.first_name} ${user.last_name}`.toLowerCase().includes(filter.user.toLowerCase()))).map((user) => (
            <MenuItem
              key={user.id}
              value={user.id}
              style={getStyles(user.id, userId, theme)}
            >
              {`${user.first_name} ${user.last_name}`}
            </MenuItem>
          ))}
        </Select>
        <Form.Text muted>
        Add other people who you would like 
        to be able to edit this entry
      </Form.Text>
      </FormControl>
        <Button className="mt-5" variant="contained" onClick={handleSave}>
            Save
          </Button>
        </>
        
    )
}

export default ProjectForm