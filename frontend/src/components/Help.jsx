import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useSelector } from "react-redux";
import { dataData, authedUser } from "../reducers/data";
import Details from './Details';
import List from '@mui/material/List';


function Help() {
    const data = useSelector(dataData);
  const faqs = data["faq"] ? data["faq"] : []
  const current_user = useSelector(authedUser);

  return (
    <div id='help' className='m-3'>
      <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="div"
      aria-labelledby="nested-list-subheader"
      className='px-5 bg-transparent'
    >
      <Typography className='mb-3' variant='h2'>Instructions</Typography>

    
    {faqs.filter((f)=>f["manual"] && !f["admin"]).map((f)=>
    <div key={f["id"]} className='position-relative w-100'>
      <Details data={f} child={true} table={"faq"}/>
      </div>
     )}
    
    {faqs.filter((f)=>f["manual"] && f["admin"] && (current_user && current_user.is_superuser)).map((f)=>
    <div key={f["id"]} className='position-relative w-100'>
      <Typography className='d-block w-100 position-absolute text-end pe-3 mt-2 text-danger' variant='small'>admin</Typography>
      <Details className="admin" data={f} child={true} table={"faq"}/>
      </div>
     )}
    
    </List>

    <Divider className='mt-5'/>
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="div"
      aria-labelledby="nested-list-subheader"
      className='px-5 mt-2'
    >

    <Typography className='mb-3' variant='h2'>FAQs</Typography>
    {faqs.filter((f)=>!f["manual"] && !f["admin"]).map((f)=> 
      <div key={f["id"]} className='position-relative w-100'>
      <Details data={f} child={true} table={"faq"}/>
      </div>

    )}
    {faqs.filter((f)=>!f["manual"] && f["admin"] && (current_user && current_user.is_superuser)).map((f)=> 
      <div key={f["id"]} className='position-relative w-100'>
      <Typography className='d-block w-100 position-absolute text-end pe-3 mt-2 text-danger' variant='small'>admin</Typography>
      <Details className="admin" data={f} child={true} table={"faq"}/>
      </div>

    )}

    </List>
    </div>
  );
}

export default Help;