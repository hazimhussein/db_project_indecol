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
import Details from './Details';



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function Help() {
    const data = useSelector(dataData);
  const faqs = data["faq"] ? data["faq"] : []

  return (
    <>
    {faqs.map((f)=> <Details data={f} child={true} table={"faq"}/>)}
    </>
  );
}

export default Help;