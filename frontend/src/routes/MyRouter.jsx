// import libraries from react
import { useState, useContext, forwardRef, useEffect } from "react";
// import react-router-dom
import {
        BrowserRouter as Router,
        Routes,
        Route,
        Link,
} from 'react-router-dom';
// import libraries from material-ui
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Dialog, DialogTitle, DialogActions } from '@mui/material';
import Slide from '@mui/material/Slide';
// import our components
import HomepageContainer from '../components/homePage/HomepageContainer';
import UserAccount from '../components/navBar/UserAccount';
import ContactUs from '../components/navBar/ContactUs';
import About from '../components/navBar/About';
import Footer from '../components/footer/Footer';
import Image from '../components/Image';
import FindMyPetBreeds from '../components/navBar/FindMyPetBreeds';
import UserStatus from '../components/forms/UserStatus';
import SignIn from '../components/forms/SignIn';
import SignUp from '../components/forms/SignUp';
import ImageForm from '../components/forms/ImageForm';
import RequestStatus from '../components/forms/RequestStatus';
import ScrollToTop from '../components/ScrollToTop';
import SimillarityResults from '../components/forms/SimilarityResults';
import NoResults from '../components/forms/NoResults';
import NotFoundPage from '../components/NotFoundPage';
import { AuthContext } from '../context/AuthContext';
// import css
import '../assets/css/MyRouter.css';

const localhost = process.env.LOCAL_HOST;

const Transition = forwardRef((props, ref) => {
        return <Slide direction="up" ref={ref} {...props} />;
});


const MyRouter = () => {

        const pages = [
                { key: 'About', value: 'אודות' },
                { key: 'ContactUs', value: 'צור קשר' },
                { key: 'FindMyPetBreeds', value: 'מזהה הגזעים' },
                { key: 'UserStatus', value: 'צא לדרך' },
        ];

        const image = {
                src: require('../assets/images/dog.jpg'),
                alt: "dog_image",
                title: "חזרה לדף הבית",
                style: {
                        height: '69px',
                        width: '70px',
                        borderRadius: '50%',
                        border: '2px solid #333',
                        backgroundColor: '#fff',
                        color: 'blue',
                        cursor: 'pointer',
                        marginTop: '8px',
                }
        }

        const { user, logout } = useContext(AuthContext);
        const [nav, setNav] = useState(null);
        const [user1, setUser1] = useState(null);
        const [open, setOpen] = useState(false);

        const handleOpenUserMenu = (event) => {
                setUser1(event.currentTarget);
        };

        const handleCloseNavMenu = () => {
                setNav(null);
        };

        const handleCloseUserMenu = () => {
                setUser1(null);
        };

        const handleOpen = () => {
                setOpen(true);
        };

        const handleClose = () => {
                setOpen(false);
        };

        const handleLogout = () => {
                logout();
                // Redirect the user to the login page
                window.location.href = "/";
                handleClose();
        };

        const settings = user.isLoggedIn /*&& !user.first_time_Logged_in*/ ? [
                { key: '/UserAccount', value: 'אזור אישי' },
                { key: '/UserStatus', value: 'צא לדרך' },
                {
                        key: window.location.pathname,
                        value: 'התנתקות',
                        onClick: handleOpen,
                }
        ] : [{ key: 'SignIn', value: 'התחברות' }];
        
        return (
                <>
                        <Router>
                                <ScrollToTop>
                                        {/* sticky position allows the menu to be displayed even when scrolling */}
                                        <AppBar className="appBar" position="sticky" sx={{ backgroundColor: '#333333' }}>
                                                <Container maxWidth="xl" sx={{ mr: '2px', ml: '2px', display: 'grid' }}>
                                                        <Toolbar disableGutters>
                                                                <Link to='/'>
                                                                        <Image img={image} />
                                                                </Link> &nbsp; &nbsp;

                                                                {pages.map((page) => (
                                                                        <MenuItem key={page.key} onClick={handleCloseNavMenu}>
                                                                             
                                                                                        <Link className='link' to={`/${page.key}`}>
                                                                                        <Button
                                                                                                sx={{ my: 2, color: "white", display: "block" }}
                                                                                        >
                                                                                                {page.value}
                                                                                        </Button>
                                                                                </Link> 
                                                                        </MenuItem>
                                                                ))}
                                                         

                                                                {/*From here it's the user icon and his menu */}
                                                                <div id='iconPosition'>
                                                                        <Tooltip title="הגדרות" sx={{ position: 'relative' }}>
                                                                                <IconButton onClick={handleOpenUserMenu} sx={{
                                                                                        p: 0, mr: 'auto', ml: 'auto', display: "block", position: 'absolute', left: '0px',
                                                                                }}>
                                                                                        {/* pets icons - https://github.com/Ivanmtta/anonymous-animals-api */}
                                                                                        {user.isLoggedIn /*&& !user.first_time_Logged_in*/ ? < Avatar alt={`${user.first_name}`} title={`${user.first_name} ${user.last_name}`} sx={{ width: '65px', height: '65px', my: -1.5, backgroundColor: '#FF8A00', border: '2px solid #fff', }} src={`https://anonymous-animals.azurewebsites.net/avatar/:${user.email}`} /> : < Avatar alt="no one" title="no one" />}
                                                                                </IconButton>
                                                                        </Tooltip>
                                                                </div>

                                                                <Menu
                                                                        sx={{ mt: "45px" }}
                                                                        id="menu-appbar"
                                                                        anchorEl={user1}
                                                                        anchorOrigin={{
                                                                                vertical: "top",
                                                                                horizontal: "right",
                                                                        }}
                                                                        keepMounted
                                                                        transformOrigin={{
                                                                                vertical: "top",
                                                                                horizontal: "right",
                                                                        }}
                                                                        open={Boolean(user1)}
                                                                        onClose={handleCloseUserMenu}

                                                                >
                                                                        {settings.map((setting) => (
                                                                                <MenuItem key={setting.key} onClick={setting.onClick}>
                                                                                        {setting.value!=="התנתקות"?(
                                                                                        <Link className='link' to={`${setting.key}`}>
                                                                                                <Typography sx={{ color: "black" }}> {setting.value}</Typography>
                                                                                        </Link>):(   
                                                                                        <Typography sx={{ color: "black" }}> {setting.value}</Typography>)}
                                                                                </MenuItem>
                                                                        ))}

                                                                        <Dialog
                                                                                open={open}
                                                                                TransitionComponent={Transition}
                                                                                keepMounted
                                                                                onClose={handleClose}
                                                                                aria-describedby="alert-dialog-slide-description"
                                                                        >
                                                                                <DialogTitle>{"האם לבצע התנתקות מהאתר?🐾"}</DialogTitle>
                                                                                <DialogActions>
                                                                                        <Button onClick={handleClose}>ביטול</Button>
                                                                                        <Button onClick={handleLogout}>כן</Button>
                                                                                </DialogActions>
                                                                        </Dialog>
                                                                </Menu>
                                                        </Toolbar>
                                                </Container>
                                        </AppBar>
                                        <Routes>
                                                <Route path='/' element={<HomepageContainer />}></Route>
                                                <Route path='/UserAccount' element={<UserAccount />}></Route>
                                                <Route path='/ContactUs' element={<ContactUs />}></Route>
                                                <Route path='/About' element={<About />}></Route>
                                                <Route path='/FindMyPetBreeds' element={<FindMyPetBreeds />}></Route>
                                                <Route path='/UserStatus' element={<UserStatus />}></Route>
                                                <Route path='/SignIn' element={<SignIn />}></Route>
                                                <Route path='/SignUp' element={<SignUp />}></Route>
                                                <Route path='/ImageForm' element={<ImageForm />}></Route>
                                                <Route path='/RequestStatus' element={<RequestStatus />}></Route>
                                                <Route path='/SimillarityResults' element={<SimillarityResults />}></Route>
                                                <Route path='/NoResults' element={<NoResults />}></Route>
                                                <Route path="*" element={<NotFoundPage />}></Route>
                                        </Routes>
                                        <Footer />
                                </ScrollToTop>
                        </Router >
                </>
        );
}

export default MyRouter;
