import ProgressBar from 'react-bootstrap/ProgressBar';
import { statusData, progressData } from "../reducers/data";
import { useSelector } from "react-redux";
import { Typography } from '@mui/material';

function Progress() {
    const status = useSelector(statusData);
    const progress = useSelector(progressData);

  return (
  <div className='position-fixed w-100 h-100 d-flex flex-column justify-content-center align-items-center' style={{ zIndex : 99999,  backgroundColor: '#000000aa'}}> 
    <ProgressBar className='w-75' animated now={progress} label={progress != 100 ? `${progress}%` : undefined} />
    <Typography variant="h1" className={`text-white loading`}>
        Loading {progress != 100 ? `${progress}% . . .` : ". . ."}
    </Typography>
  </div>)
}

export default Progress;