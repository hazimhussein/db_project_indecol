import { useState } from "react";
import { useSelector } from "react-redux";
import Card from "./Card";
import TableView from "./TableView";
import { dataData, authedUser, statusData, dataLoaded } from "../reducers/data";
import { useParams } from "react-router-dom";
import NavTop from "./Nav";
import LoadingBar from "react-redux-loading-bar";
import { FaQuestionCircle } from "react-icons/fa";
import { Modal, Box, IconButton, Fab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {tables_order, admin_tables, main_developers} from "../config"
import About from "./About";
import Help from "./Help";
import Progress from "./Progress";

function Dashboard() {
  let { category } = useParams();
  category = category ? category : "category";

  const data = useSelector(dataData);
  const status = useSelector(statusData);
  const loaded = useSelector(dataLoaded);
  const team = data["team"] ? data["team"] : []

  let data_current = data[category] ? data[category] : [];
  const current_user = useSelector(authedUser);
  
  //* Modal *//
  const [modalOpened, setModalOpened] = useState(false);

  const [searchInput, handleSearchChange] = useState("");

  return (
    <>
      {(status == "loading" || !loaded) && <Progress />}
      <LoadingBar />
      <NavTop />
      <Modal open={modalOpened ? true : false} onClose={() => setModalOpened(false)}>
        <Box
          style={{
            position: "absolute",
            top: "5%",
            left: "5%",
            width: "90%",
            height: "90%",
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            padding: "10px",
          }}
        >
          <IconButton
            onClick={() => setModalOpened(false)}
            className="position-absolute"
            style={{ right: "10px", zIndex: "9999" }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          {modalOpened == "about" ? <About/> : modalOpened == "help" && <Help/>}
        </Box>
      </Modal>
      <div className="dashboard">
        {category == "category" ? (
          <div className="questions">
            <div key="search-bar" className="form-group row">
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  id={`colFormLabelSearchBar`}
                  value={searchInput}
                  placeholder="Search..."
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
            {tables_order.filter((dat)=>dat.toLowerCase().includes(searchInput.toLowerCase())).map((dat)=>
              data_current.map((d)=>d.name.toLowerCase()).includes(dat.toLowerCase()) &&
                data_current.filter(
                  (d) => d.name.toLowerCase() == dat.toLowerCase()
                )
                .map((cat) => 
                  <Card
                    key={cat.id}
                    id={cat.id}
                    table={category}
                    data={cat}
                  />
                )) 
            }
            {data_current
              .filter(
                (dat) =>
                  dat.name.toLowerCase().includes(searchInput.toLowerCase()) &&
                  !tables_order.map(d=>d.toLowerCase()).includes(dat.name.toLowerCase())
              )
              .map((cat) =>
                !admin_tables.map(d=>d.toLowerCase()).includes(cat.name.toLowerCase()) ? (
                  <Card
                    key={cat.id}
                    id={cat.id}
                    table={category}
                    data={cat}
                  />
                ) : (
                  current_user &&
                  current_user.is_superuser && (
                    <Card
                      key={cat.id}
                      id={cat.id}
                      table={category}
                      data={cat}
                    />
                  )
                )
              )}
          </div>
        ) : (
          loaded && <TableView key={category} table={category} />
        )}
      </div>
      <Fab
        variant="extended"
        style={{ position: "fixed", bottom: "15px", right: "15px" }}
        onClick={() => setModalOpened("about")}
      >
        <img
              alt=""
              src="/assets/images/IEDL-logo-v2.png"
              width="50"
              height="50"
              className="d-inline-block align-top"
            />
        About Us
      </Fab>
      <Fab
        variant="extended"
        style={{ position: "fixed", bottom: "15px", left: "15px" }}
        onClick={() => setModalOpened("help")}
      >
        <FaQuestionCircle className="h3 m-0 me-1" />
        Help
      </Fab>
    </>
  );
}

export default Dashboard;
