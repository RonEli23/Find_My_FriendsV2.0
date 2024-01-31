// import libraries from react
import { useState, useRef } from "react";
// import libraries from material-ui
import Button from '@mui/material/Button';
// import our components
import Loader from '../Loader';
import PetDetails from "./PetDetails";
// import css
import "../../assets/css/ImageForm.css";
// import axios 
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8080/route';

// drag drop file component
const ImageForm = () => {
        // drag state
        const [dragActive, setDragActive] = useState(false);
        const [image, setImage] = useState({ preview: '', data: '' });
        const [response, setResponse] = useState("");
        const [dragText, setDragText] = useState("אפשר לגרור את התמונה לפה\n\n או");
        const [uploadText, setUploadText] = useState("להעלות קובץ בלחיצה");
        const [tipText, setTipText] = useState("טיפ קטן: לתוצאות מיטביות על התמונה להיות ברורה ככל הניתן ולהכיל את כל גוף החיה ")

        // ref
        const inputRef = useRef(null);
        const [loading, setLoading] = useState(false);

        const [pet_type, setPetType] = useState("");
        const [pet_breeds, setPetBreeds] = useState("");

        const [errMassage, setErrMassage] = useState("");

        // handle drag events
        const handleDrag = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.type === "dragenter" || e.type === "dragover") {
                        setDragActive(true);
                } else if (e.type === "dragleave") {
                        setDragActive(false);
                }
        };

        // triggers when file is dropped
        const handleDrop = (e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        const img = {
                                preview: URL.createObjectURL(e.dataTransfer.files[0]),
                                data: e.dataTransfer.files[0]
                        }
                        setImage(img);
                        setDragText("");
                        setUploadText("");
                        setTipText("");
                }
        };

        // triggers when file is selected with click
        const handleChange = (e) => {
                e.preventDefault();
                if (e.target.files && e.target.files[0]) {
                        const img = {
                                preview: URL.createObjectURL(e.target.files[0]),
                                data: e.target.files[0],
                        }
                        setImage(img);
                        setDragText("");
                        setUploadText("");
                        setTipText("");
                }
        };

        // triggers the input when the button is clicked
        const onButtonClick = () => {
                inputRef.current.click();
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                let formData = new FormData();
                formData.append('file', image.data);

                try {
                        setLoading(true);
                        const res = await axios.post('/uploadImage', formData);
                        window.scrollBy(0, 10);
                        if (res.data?.error === "No file was uploaded.") {
                                setLoading(false);
                                setErrMassage(`אופס! נראה ששכחת להעלות תמונה`);
                        }
                        else if (res.data?.error === "Internal server error.") {
                                setLoading(false);
                                setErrMassage(`.אופס! נראה שהעלת סוג קובץ לא נכון\n .jpg, jpeg, png :יש לעלות קבצים מסוג`);
                        }
                        else if (res.data?.error === "File upload failed.") {
                                setLoading(false);
                                setErrMassage(`1 MB אופס! יש לעלות קובץ עד`);
                        }
                        else {
                                setPetType(res.data.pet_type);
                                setPetBreeds(res.data.breeds);
                                setResponse(res.data);
                                setLoading(false);
                        }
                } catch (err) {
                        setLoading(false);
                        setErrMassage(err.message);
                        console.log(err);
                }
        };

        return (
                <>
                        {loading ? <Loader /> :
                                (!response ? <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                                        <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} name="file" />
                                        <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : ""}>
                                                <div>
                                                        {image.preview ? <img src={image.preview} alt='UploadImage' width='300' height='300' /> : null}
                                                        <p>{dragText}</p>
                                                        <button className="upload-button" onClick={onButtonClick}>{uploadText}</button>
                                                        <br></br><br></br>
                                                        <p>{tipText}</p>
                                                </div>
                                        </label>
                                        {dragActive ? <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>:null}
                                        <br></br>
                                        <Button variant="contained" type='submit' onClick={handleSubmit}>שלח</Button>
                                        <br></br>
                                        {errMassage ? <p className="response err">{errMassage}</p>:null}
                                </form>
                                        : <PetDetails pet_type={pet_type} pet_breeds={pet_breeds} />)
                        }
                </>
        );
};

export default ImageForm;