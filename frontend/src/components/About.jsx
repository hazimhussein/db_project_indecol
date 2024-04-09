import AppBar from '@mui/material/AppBar';
import Card from './Card';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from "react-redux";
import { dataData } from "../reducers/data";
import { main_developers } from "../config"
import { Navbar } from 'react-bootstrap';



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function About() {
    const data = useSelector(dataData);
  const team = data["team"] ? data["team"] : []

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          {/* <CameraIcon sx={{ mr: 2 }} /> */}
          <Typography variant="h6" color="inherit" noWrap>
            About the developers...
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
        style={{
            overflowY: "visible",
            width: "100%",
          }}
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container align="center">
          <Box
            component="img"
            sx={{
              maxWidth: { xs: 250, md: 250 },
            }}
            align="center"
            alt="Industrial Ecology Digital Lab Logo"
            src="/assets/images/IEDL-logo.png"
          />
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              The digital laboratory (IEDL)
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph className='px-2'>
                IEDL is one of the teams in the Industrial Ecology program at the Norwegian
                University of Science and Technology (NTNU) was created for 
                the main objectives to
                <Typography variant="h6" align="left" color="text.secondary" paragraph className='px-5 fw-lighter'>
                <br/>(a) consolidate available infrastructure and ease the integration of 
                newly developed tools by providing code and data exchange standards across 
                the group
                <br/>(b) develop novel software based on common needs across the IE programme,
                 thereby building an IE software and data toolbox
                <br/>(c) explore synergies with other research groups by connecting to similar 
                initiatives in the sustainability and environmental research community
                </Typography>
                <br/>Read more about <Link color="inherit" href="https://iedl.no/">IEDL here</Link>
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }}>
        <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              IEDL members
            </Typography>
            
          {/* End hero unit */}
          <Grid container spacing={4} className='justify-content-center'>
            {team.filter(
                  (m) => m.role.toLowerCase().includes("manager")
                )
                .map((cat) => 
                  cat && <Card
                    key={cat.id}
                    id={cat.id}
                    table="team"
                    data={cat}
                  />
                )}
          </Grid>
          {/* <Typography
              component="h3"
              variant="h4"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Main developers to contact in case of technical issues
            </Typography> */}
          <Grid container spacing={4} className='justify-content-center'>
          {/* {main_developers.map((nam)=>
              team.map((m)=>m.last_name.toLowerCase()).includes(nam.toLowerCase()) &&
                team.filter(
                  (m) => m.last_name.toLowerCase() == nam.toLowerCase()
                )
                .map((cat) => 
                  <Card
                    key={cat.id}
                    id={cat.id}
                    table="team"
                    data={cat}
                  />
                )) 
            } 
            {team.filter(
                  (m) => !main_developers.map(n=>n.toLowerCase()).includes(m.last_name.toLowerCase())
                  && !m.role.toLowerCase().includes("manager")
                )
                .map((cat) => 
                  <Card
                    key={cat.id}
                    id={cat.id}
                    table="team"
                    data={cat}
                  />
                )
            } */}
            {team.filter(
                  (m) => !m.role.toLowerCase().includes("manager")
                )
                .map((cat) => 
                  cat && <Card
                    key={cat.id}
                    id={cat.id}
                    table="team"
                    data={cat}
                  />
                )}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box
        style={{
            overflowY: "visible",
            width: "100%",
          }}
          sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
            <Navbar.Brand color="inherit" className='d-flex justify-content-center'>
            <img
              alt=""
              src="/assets/images/logo.png"
              width="100"
              height="100"
              className="d-inline-block align-top"
            />
            <span className="d-flex align-items-center ms-2 fw-bolder">IndEcX</span>
          </Navbar.Brand>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}

export default About;