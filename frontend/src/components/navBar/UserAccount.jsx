// import libraries from react
import { useState, useEffect, useContext } from 'react';
// import react-router-dom
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import libraries from material-ui
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
// import Buffer
import { Buffer } from "buffer";
// import our components
import { AuthContext } from '../../context/AuthContext';
import Loader from '../Loader';
// import our images
import dog_with_cat from '../../assets/images/dog_with_cat.jpg';
// import css
import '../../assets/css/UserAccount.css';
// import axios
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
const USER_INFO_URL = '/users/userInfo';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return formattedDate;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const UserAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  // const [formErrors, setFormErrors] = useState([]);
  // const [formSuccess, setFormSuccess] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [textErr, setText] = useState("");
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setLoading(true);
    axiosPrivate.get(USER_INFO_URL, {
      params: {
        email: user.email
      }
    })
      .then(response => {
        setRequests(response.data);
        setLoading(false);

      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        navigate('/SignIn', { state: { from: location }, replace: true });
      });
  }, []);

  useEffect(() => {
    if (!user.isLoggedIn) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleDelete = async () => {
    const confirmed = window.confirm(`היי ${user.first_name} ${user.last_name} האם אתה/את בטוחים שברצונכם למחוק את המשתמש? פעולה זו היא סופית ולא ניתנת לשחזור! `);
    if (confirmed) {
      try {
        const response = await axiosPrivate.delete(`users/${user.email}`);
        if (response.status === 200) {
          setOpen(true);
          setTimeout(() => {
            logout();
            navigate("/");
          }, 5000);
        }
      } catch (error) {
        handleErrors(error);
        console.log(error.message);
      }
    }
  };

  const handleErrors = (err) => {
    setFlag(true)
    if (err.response?.data && err.response?.data.errors) {
      // Handle validation errors
      const errors = err.response.data.errors;
      console.log(errors);

      let errMsg = "";

      if (errors.length > 1) {
        for (let error of errors) {
          const errorMsg = error.msg;
          console.log(error.param);
          errMsg += `${errorMsg}\n`;
        }
      }
      else {
        errMsg = errors[0].msg;
      }
      setText(errMsg);
    } else {
      // Handle generic error
      setText(["אופס! משהו השתבש"]);
    }
  };

  return (
    <>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogContent dividers>
          <Typography gutterBottom>
            איזה יופי! המשתמש נמחק בהצלחה!
          </Typography>
        </DialogContent>
      </BootstrapDialog>

      <div className="userWrapper">
        <div className="userHeading">
          <section className="userText">
            <h1>ברוך הבא {user.first_name}</h1>
            <img alt="hugcatdog" src={dog_with_cat} />
            <br></br>
            {user.email && <Link to='/RequestStatus'>
              <Button variant="contained">להוספת פנייה</Button>
            </Link>}
            &nbsp; &nbsp;
            <Button onClick={handleDelete} variant="contained">מחיקת המשתמש</Button>
            {flag ? (
                <div>
                  <br /><br />
                  <Alert severity="error" sx={{ whiteSpace: 'pre-line' }}>
                    {textErr}
                    </Alert>
                    </div>) : null}
          </section>
        </div>

        {loading ? <Loader /> : requests.length > 0 &&
          <TableContainer className="tableWrapper" component={Paper}>
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h5"
              id="tableTitle"
              align="center"
              component="div">
              טבלת פניות
            </Typography>
            <br></br>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className="requestTableHead">
                <TableRow>
                  <TableCell align="center">סוג החיה</TableCell>
                  <TableCell align="center">שם החיה</TableCell>
                  <TableCell align="center">תמונה</TableCell>
                  <TableCell align="center">גזע החיה</TableCell>
                  <TableCell align="center">מצאתי/איבדתי</TableCell>
                  <TableCell align="center">תאריך העלאת הפנייה</TableCell>
                  <TableCell align="center">מיקום</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="center">{request.petType === 'cat' ? 'חתול' : 'כלב'}</TableCell>
                    <TableCell align="center">{request.petName}</TableCell>
                    <TableCell align="center"><img
                      src={`data:${request.img.contentType};base64,${Buffer.from(request.img.data.data).toString('base64')}`}
                      title={request.petName}
                      alt={request.petName}
                      className="person-img"
                      width="30"
                    /></TableCell>
                    <TableCell align="center"><pre>{request.petBreeds}</pre></TableCell>
                    <TableCell align="center">{request.status === "lost" ? "איבדתי" : "מצאתי"}</TableCell>
                    <TableCell align="center">{formatDate(request.date)}</TableCell>
                    <TableCell align="center">{request.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>}
      </div >
    </>
  );
}

export default UserAccount; 