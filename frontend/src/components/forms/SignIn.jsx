// import from react
import { useState, useContext } from 'react';
// import react-router-dom
import { Link, useNavigate, useLocation  } from 'react-router-dom';
// import libraries from material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
// import our components
import { AuthContext } from '../../context/AuthContext';
//import useAuth from '../../hooks/useAute.js';

// import axios
// import axios from 'axios';
// axios.defaults.baseURL = 'http://127.0.0.1:8080/route';

import axios from '../../api/axios';
const LOGIN_URL = '/auth';


const theme = createTheme();

const SignIn = () => {
        const initialFormData = {
                email: "",
                user_password: ""
        };

        //const { setAuth, persist, setPersist } = useAuth();

        const [formData, setFormData] = useState(initialFormData);
        const [showPassword, setShowPassword] = useState(false);

        const navigate = useNavigate();
        const location = useLocation();
        const from = location.state?.from?.pathname || "/";

        const { login } = useContext(AuthContext);
        const [emailError, setEmailError] = useState(false);
        const [passwordError, setPasswordError] = useState(false);
        const [textErr, setText] = useState("");
        const [flag, setFlag] = useState(false);

        const handleChange = (e) => {
                setFormData({
                        ...formData,
                        [e.target.name]: e.target.value,
                });
        };

        const handleClickShowPassword = () => {
                setShowPassword((show) => !show);
        }

        const handleMouseDownPassword = (event) => {
                event.preventDefault();
        };

        const handleErrors = (err) => {
                setFlag(true)
                if (err.response?.data && err.response?.data.errors) {
                        // Handle validation errors
                        const errors = err.response.data.errors;

                        let errMsg = "";
                        if (errors.length > 1) {
                                for (let error of errors) {
                                        const errorMsg = error.msg;
                                        console.log(error.param);
                                        if (error.param === "email") {
                                                setEmailError(true);
                                                errMsg += `${errorMsg}\n`;
                                        }
                                        else {
                                                setPasswordError(true);
                                                errMsg += `${errorMsg}\n`;
                                        }
                                }
                        }
                        else {
                                if (errors[0].param === "email") {
                                        setEmailError(true);
                                }
                                else {
                                        setPasswordError(true);
                                }
                                errMsg = errors[0].msg;
                        }
                        setText(errMsg);
                } else {
                        // Handle generic error
                        setText(["אופס! משהו השתבש"]);
                }
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                setPasswordError(!formData.user_password);
                setEmailError(!formData.email);

                if (!formData.user_password || !formData.email) {
                        setText("אוי! נראה שחלק מהשדות ריקים");
                        setFlag(true);
                        return;
                }
                try {
                        const res = await axios.post(LOGIN_URL,
                                JSON.stringify(formData),
                                {
                                        headers: { 'Content-Type': 'application/json' },
                                        withCredentials: true
                                }
                        );

                        console.log(JSON.stringify(res?.data));

                        if (res.data?.message === "User not found") {
                                setFlag(true);
                                setEmailError(true);
                                setText("אוי! נראה שהמשתמש לא קיים במערכת");
                        }
                        else if (res.data?.message === "Password is not the same") {
                                setFlag(true);
                                setPasswordError(true);
                                setText("אוי! נראה שהסיסמה שהוזנה לא תואמת למה ששמור במערכת");
                        }
                        else {
                                const accessToken = res.data?.accessToken;
                                setFormData(res.data);
                                login(res.data?.first_name, res.data?.last_name, res.data?.email, res.data?.phone_number, accessToken);
                                //return navigate("/RequestStatus");
                                navigate(from, { replace: true });
                        }
                } catch (err) {
                        handleErrors(err);
                        console.log(err.message);
                }
        };

        return (
                <ThemeProvider theme={theme}>
                        <Container component="main" maxWidth="xs">
                                <CssBaseline />

                                <Box
                                        sx={{
                                                marginTop: 8,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                        }}
                                >
                                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                                <LockOutlinedIcon />
                                        </Avatar>
                                        <Typography component="h1" variant="h5">
                                                כניסה
                                        </Typography>

                                        {flag && <div><br></br><br></br> <Alert severity="error" sx={{ whiteSpace: 'pre-line' }}>
                                                {textErr}
                                        </Alert></div>}

                                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                                <TextField
                                                        sx={{
                                                                "& label": {
                                                                        left: "unset",
                                                                        right: "1.75rem",
                                                                        transformOrigin: "right",
                                                                },
                                                                "& legend": {
                                                                        textAlign: "right",
                                                                        fontSize: "0.6rem",
                                                                },
                                                        }}
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="email"
                                                        label="כתובת מייל"
                                                        name="email"
                                                        autoComplete="email"
                                                        autoFocus
                                                        value={formData.email}
                                                        error={emailError}
                                                        onChange={handleChange}
                                                />
                                                <br /> <br />
                                                <FormControl
                                                        sx={{
                                                                width: '50ch',
                                                                "& label": {
                                                                        left: "unset",
                                                                        right: "1.75rem",
                                                                        transformOrigin: "right",
                                                                },
                                                                "& legend": {
                                                                        textAlign: "right",
                                                                        fontSize: "0.6rem",
                                                                },
                                                        }} variant="outlined">
                                                        <InputLabel htmlFor="outlined-adornment-password">סיסמא</InputLabel>
                                                        <OutlinedInput
                                                                spellCheck="false"
                                                                margin="dense"
                                                                required
                                                                fullWidth
                                                                error={passwordError}
                                                                name="user_password"
                                                                label="סיסמא"
                                                                autoComplete="current-password"
                                                                value={formData.user_password}
                                                                onChange={handleChange}
                                                                id="outlined-adornment-password"
                                                                type={showPassword ? 'text' : 'password'}
                                                                endAdornment={
                                                                        <InputAdornment position="end">
                                                                                <IconButton
                                                                                        aria-label="toggle password visibility"
                                                                                        onClick={handleClickShowPassword}
                                                                                        onMouseDown={handleMouseDownPassword}
                                                                                        edge="end"
                                                                                >
                                                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                                </IconButton>
                                                                        </InputAdornment>
                                                                }
                                                        />
                                                </FormControl>
                                                <br />
                                                <FormControlLabel
                                                        control={<Checkbox value="remember" color="primary" />}
                                                        label="זכור אותי"
                                                />
                                                <Button
                                                        type="submit"
                                                        fullWidth
                                                        variant="contained"
                                                        sx={{ mt: 3, mb: 2 }}
                                                >
                                                        התחברות
                                                </Button>
                                                <Grid container>
                                                        <Grid item xs>
                                                                <Link to='/SignUp' variant="body2">
                                                                        {"אין לך חשבון? הירשם"}
                                                                </Link>
                                                        </Grid>
                                                </Grid>
                                        </Box>
                                </Box>
                        </Container>
                </ThemeProvider >
        );
}

export default SignIn;