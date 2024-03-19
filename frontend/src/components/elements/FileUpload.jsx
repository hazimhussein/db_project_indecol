import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useState, useEffect } from 'react';
import ReactLoading from "react-loading";
import { img_ext, vid_ext } from '../../config';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function InputFileUpload({field, options, setOptions}) {
    const [isLoading, setIsLoading] = useState(false)
    const [file, setFile] = useState()
    
    const update_file = (fil) => {
        setOptions({...options, [field]: fil})
        if (fil != "" && (fil.type.includes("image") || fil.type.includes("video")) && fil.size < 20000000){
          setIsLoading(true)
          var fr = new FileReader();
          fr.onload = function () {
              setFile(fr.result)
              setIsLoading(false)
          }
          fr.readAsDataURL(fil);
        } else if (fil != "") {
          setFile(fil.name)
        } else {
          setFile(fil)
        }
        
    }

    useEffect(()=>{
        options && options[field] && options[field].constructor == File ? update_file(options[field])
        : typeof options[field] == "string" && options[field].includes("http") 
        && ((img_ext.includes(options[field].slice(-6).split(".").at(-1)) || vid_ext.includes(options[field].slice(-6).split(".").at(-1)))
        ? fetch(options[field]).then(res=>res.blob()).then(blob=> {
          const new_file = new File([blob], options[field].split('/').pop(), {type: blob.type})
          update_file(new_file)
        })
        : setFile(options[field]))
      }, [])

  return (
    isLoading ? <ReactLoading type="bars" color="#0f0" />
      :<>
      <div>
      {file && 
      <Button
      component="label"
      className='my-3 me-2'
      variant="contained"
      color="error"
      onClick={(e)=>{
        e.stopPropagation()
        e.preventDefault()
        update_file("")}
      }
      startIcon={<DeleteForeverIcon />}
    >
      Delete file
    </Button>}
    <Button
      component="label"
      className='my-3'
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput type="file" onChange={(e)=>update_file(e.target.files[0])}/>
    </Button>
    </div>
    {file && (file.includes("image")
                                            ? <img src={file}/> 
                                            : file.includes("video")
                                            ? (<video className="w-100" controls autoPlay loop>
                                                <source src={file} />
                                                </video>)
                                            : file.constructor == File
                                            ? file.name
                                            : typeof file == "string" && file.split('/').pop())}
    </>
  );
}