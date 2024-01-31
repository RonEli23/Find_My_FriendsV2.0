// import react-router-dom
import { Link } from "react-router-dom";
// import libraries from material-ui
import Button from "@mui/material/Button";
// import image
import PageNotFound from "../assets/images/PageNotFound.jpg";
// import css
import "./../assets/css/NotFoundPage.css";

const NotFoundPage = () => {
        return <div className="PageNotFound">
                <img src={PageNotFound} alt="404" />
                <p>
                        <Button
                                variant="contained"
                                color="success"
                                component={Link}
                                to="/">
                                חזרה לדף הבית
                        </Button>
                </p>
        </div>;
}

export default NotFoundPage;