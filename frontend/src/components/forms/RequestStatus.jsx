// קונטקסט - משתמש נכנס כבר היום/לא
// במידה ולא - מעבר לטופס כניסה
// במידה וכן - מעבר לקומפוננטה הבאה
// update status - context

// import libraries from react
import { useContext, useEffect } from "react";
// import react-router-dom
import { Link, useNavigate } from "react-router-dom";
// import libraries from material-ui
import { Button, Container, Grid } from "@mui/material";
// import our components
import { AuthContext } from "../../context/AuthContext";
import { UserRequestContext } from "../../context/UserRequestContext";

const RequestStatus = () => {
        const { user } = useContext(AuthContext);
        const { updateStatus } = useContext(UserRequestContext);
        const navigate = useNavigate();

        useEffect(() => {
                if (!user.isLoggedIn) {
                        navigate('/UserStatus');
                }
        }, [user, navigate]);

        return (
                <>
                        <Container sx={{ mt: "236px" }}>
                                <Grid container justifyContent="center" spacing={12}>
                                        <Grid item>
                                                <Button
                                                        variant="contained"
                                                        color="success"
                                                        sx={{
                                                                width: "200px",
                                                                height: "80px",
                                                                backgroundColor: "hsl(113, 34%, 42%)",
                                                                fontSize: "25px",
                                                        }}
                                                        onClick={() => updateStatus("lost")}
                                                        component={Link}
                                                        to="/ImageForm"
                                                >
                                                        איבדתי
                                                </Button>
                                        </Grid>
                                        <Grid item>
                                                <Button
                                                        variant="contained"
                                                        sx={{
                                                                width: "200px",
                                                                height: "80px",
                                                                backgroundColor: "hsl(213, 34%, 52%)",
                                                                fontSize: "25px",
                                                        }}
                                                        onClick={() => updateStatus("found")}
                                                        component={Link}
                                                        to="/ImageForm"
                                                >
                                                        מצאתי
                                                </Button>
                                        </Grid>
                                </Grid>
                        </Container>
                </>
        );
};

export default RequestStatus;