import { TextField, Button, MenuItem, FormControl, InputLabel, OutlinedInput, Select } from "@mui/material"
import { useTheme } from '@mui/material/styles';
import TextArea from "./TextArea"
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { addTableRow, updateTableRow, getTableData } from "../../utils/api";
import { useSelector } from 'react-redux';
import { dataData } from '../../reducers/data';
import { useState } from "react";
import { Col } from "react-bootstrap";
import { Option, MultiSelect } from "./Select";
import dayjs from 'dayjs';

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
    const [resourceId, setResourcesId] = useState(data && data.ressources?data.ressources.map(resource=>resource.id):[]);
    const [projectId, setProjectsId] = useState(data && data.projects ?data.projects.map(project=>project.id):[]);
    const [userId, setUsersId] = useState(data?data.users.map(user=>user.id):[]);
    const [type, setType] = useState(data?data.type:"Master Project");
    const [startDate, setStartDate] = useState(data?dayjs(data.start_date):"");
    const [endDate, setEndDate] = useState(data?dayjs(data.end_date):"");
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
    let resources = list["ressource"] ? list["ressource"] : []
    let projects = list["project"] ? list["project"] : []
    const current_user = 1

    const handleSave = () => {
        let cols = ["project_id", "name", "description"]
        let userIds = [...userId]
        userIds.push(current_user)
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
        entry["ressources"] = resourceId
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

    return (
        <>
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
        <InputLabel id="personsLabel">Persons</InputLabel>
        <Select
          labelId="personsLabel"
          id="persons"
          name="persons"
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
        <Form.Text muted>
        Add people who are part of this Project
      </Form.Text>
      </FormControl>
      <FormControl className="py-2 w-100">
        <InputLabel id="groupsLabel">Groups</InputLabel>
        <Select
          labelId="groupsLabel"
          id="groups"
          name="groups"
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
      </FormControl>
      <FormControl className="py-2 w-100">
        <InputLabel id="partnersLabel">Partners</InputLabel>
        <Select
          labelId="partnersLabel"
          id="partners"
          name="partners"
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
      </FormControl>
      <FormControl className="py-2 w-100">
        <InputLabel id="resourcesLabel">Resources</InputLabel>
        <Select
          labelId="resourcesLabel"
          id="resources"
          name="resources"
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
          {users.filter(user=>user.id!=current_user).map((user) => (
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