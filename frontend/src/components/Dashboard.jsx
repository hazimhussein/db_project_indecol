
import { useState} from 'react'
import { useSelector } from 'react-redux'
import Question from './Question'
import TableView from './TableView'
import { dataData, statusData, authedUser } from '../reducers/data';
import { useParams } from 'react-router-dom';
import NavTop from './Nav';
import LoadingBar from 'react-redux-loading-bar'
import Fab from '@mui/material/Fab';
import { FaQuestionCircle } from 'react-icons/fa';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';



function Dashboard(){
    let { category } = useParams();
    category = category ? category : "category"

    

    const data = useSelector(dataData)
    const isLoading = useSelector(statusData)
    
    let data_current = data[category] ? data[category] : []
    const current_user = useSelector(authedUser)

  

    //* Modal *//
 
   const [modalOpened, setModalOpened] = useState(false);
    
    
    // const [optimizedView, setOptimizedView] = useState(true)
    const [searchInput, handleSearchChange] = useState("")


        return(
          <>
          <LoadingBar/>
          <NavTop/>
          <Modal open={modalOpened} onClose={() => setModalOpened(false)}>
        <Box
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '90%',
            height:'80%',
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            padding: '10px',
          }}
        >
          <IconButton onClick={() => setModalOpened(false)} className='position-absolute' style={{right:"10px"}}>
            <CloseIcon fontSize='large' />
          </IconButton>
          <div className="container-fluid row px-5 m-auto" style={{maxWidth:"1320px"}}>
          <div className="d-inline-flex col-12 col-sm-6 col-md-4 col-lg-3 flex-wrap align-content-center align-self-stretch align-items-center my-3 px-3">
            <div className="w-50 mx-auto">
              <a href="https://www.ntnu.edu/employees/konstantin.stadler" target="_blank" className="d-flex flex-column align-items-center">
                <img src="https://backends.it.ntnu.no/user-profile-service/rest/files/71680569-4233-3586-b21b-d037fb2e5f6f" alt="Konstantin Stadler" className="img-thumbnail rounded-pill" style={{aspectRatio: "1 / 1"}} title=""/>
                <div className="card-title">
                  <p>Konstantin Stadler,<br/><i>Manager and Lead Researcher of the Digital Laboratory, Industrial Ecology Programme</i></p>
                </div>
              </a>
            </div>
          </div>
          <div className="d-inline-flex col-12 col-sm-6 col-md-4 col-lg-3 flex-wrap align-content-center align-self-stretch align-items-center my-3 px-3">
            <div className="w-50 mx-auto">
              <a href="https://www.ntnu.edu/employees/mohamed.badr" target="_blank" className="d-flex flex-column align-items-center">
                <img src="https://backends.it.ntnu.no/user-profile-service/rest/files/e6621d53-1b84-38db-8916-6e75ee192af1" alt="Mohamed Badr" className="img-thumbnail rounded-pill" style={{aspectRatio: "1/1"}}/>
                <div className="card-title">
                  <p>Mohamed Badr,<br/><i>PhD Candidate</i></p>
                </div>
              </a>
            </div>
          </div>
          <div className="d-inline-flex col-12 col-sm-6 col-md-4 col-lg-3 flex-wrap align-content-center align-self-stretch align-items-center my-3 px-3">
            <div className="w-50 mx-auto">
              <a href="https://www.ntnu.edu/employees/peter.maxwell" target="_blank" className="d-flex flex-column align-items-center">
                <img src="https://backends.it.ntnu.no/user-profile-service/rest/files/cd4316e4-7fba-3d24-b5fd-b6358a7dd3b6" alt="Peter Maxwell" className="img-thumbnail rounded-pill" style={{aspectRatio: "1/1"}}/>
                <div className="card-title">
                  <p>Peter Maxwell,<br/><i>Staff Engineer</i></p>
                </div>
              </a>
            </div>
          </div>
          <div className="d-inline-flex col-12 col-sm-6 col-md-4 col-lg-3 flex-wrap align-content-center align-self-stretch align-items-center my-3 px-3">
            <div className="w-50 mx-auto">
              <a href="https://www.ntnu.edu/employees/hazim.hussein" target="_blank" className="d-flex flex-column align-items-center">
                <img src="https://backends.it.ntnu.no/user-profile-service/rest/files/1aa4f10d-d5c9-3ccd-aa85-4f4fd079f340" alt="Hazim Hussein" className="img-thumbnail rounded-pill" style={{aspectRatio: "1 / 1"}} title=""/>
                <div className="card-title">
                  <p>Hazim Hussein,<br/><i>Staff Engineer</i></p>
                </div>
              </a>
            </div>
          </div>
          <div className="d-inline-flex col-12 col-sm-6 col-md-4 col-lg-3 flex-wrap align-content-center align-self-stretch align-items-center my-3 px-3">
            <div className="w-50 mx-auto">
              <a href="https://www.ntnu.edu/employees/candy.deck" target="_blank" className="d-flex flex-column align-items-center">
                <img src="https://backends.it.ntnu.no/user-profile-service/rest/files/5da1ebb1-24f8-39d0-bc89-8b3e879e3ec9" alt="Candy Deck" className="img-thumbnail rounded-pill" style={{aspectRatio: "1 / 1"}} title=""/>
                <div className="card-title">
                  <p>Candy Deck,<br/><i>Senior Engineer</i></p>
                </div>
              </a>
            </div>
          </div>
          </div>
        </Box>
      </Modal>
            <div className='dashboard'>
                {(category == "category")? <div className='questions'>
                 
                    <div key="search-bar" className="form-group row">
                      <div className="col-sm-10">
                        <input type='text' className="form-control" id={`colFormLabelSearchBar`} value={searchInput} placeholder="Search..." onChange={(e)=>handleSearchChange(e.target.value)}/>
                      </div>
                    </div>
                    {data_current.filter(dat=> dat.name.toLowerCase().includes(searchInput.toLowerCase()) && dat.name == "project"
                    ).map(cat => <Question key={cat.id} id={cat.id} table={category} data={cat}/>)}
                    {data_current.filter(dat=> dat.name.toLowerCase().includes(searchInput.toLowerCase()) && dat.name != "project"
                    ).map(cat => cat.name != "user" ? <Question key={cat.id} id={cat.id} table={category} data={cat}/>
                    : current_user && current_user.is_superuser && <Question key={cat.id} id={cat.id} table={category} data={cat}/>
                  )}</div>
                :
                <TableView key={category} table={category}/>
                }
            </div>
            <Fab variant="extended" style={{position:"fixed", bottom:"15px", right:"15px"}}
            onClick={() => setModalOpened(true)}
            >
            <FaQuestionCircle className='h3 m-0 me-1' />
              About Us
            </Fab>
            </>)
}

export default Dashboard
