import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState, useEffect } from 'react';

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
    const [file, setFile] = useState()
    
    const update_file = (fil) => {
        setOptions({...options, [field]: fil})
        var fr = new FileReader();
        fr.onload = function () {
            setFile(fr.result)
        }
        fr.readAsDataURL(fil);
    }

    useEffect(()=>{
        options && options[field] && options[field].constructor == File ? update_file(options[field])
        : typeof options[field] == "string" && options[field].includes("http") && fetch(options[field]).then(res=>res.blob()).then(blob=> update_file(new File([blob], {type:blob.type})))
      }, [])

  return (
    <>
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
    {file && (file.includes("image")
                                            ? <img src={file}/> 
                                            : file.includes("video")
                                            ? (<video className="w-100" controls autoPlay loop>
                                                <source src={file} />
                                                </video>)
                                            : file)}
    </>
  );
}