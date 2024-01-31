// import libraries from react
import { useContext, useEffect } from "react";
// import react-router-dom
import { Link, useNavigate } from 'react-router-dom';
// import libraries from material-ui
import { Button, Container, Grid } from '@mui/material';
// import our components
import { AuthContext } from '../../context/AuthContext';
// import css
import '../../assets/css/UserStatus.css';
import '../../assets/css/basic.css';

const UserStatus = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isLoggedIn) {
      navigate('/RequestStatus');
    }
  }, [user, navigate]);

  return (
    <>
      <Container sx={{ mt: "200px" }}>
        <Grid container justifyContent="center" spacing={12}>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                width: '200px',
                height: '80px',
                backgroundColor: 'hsl(213, 34%, 52%)',
                fontSize: '25px'
              }}
              component={Link}
              to="/signUp"
            >
              חדש
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              sx={{
                width: '200px',
                height: '80px',
                backgroundColor: 'hsl(113, 34%, 42%)',
                fontSize: '25px'
              }}
              component={Link}
              to="/signIn"
            >
              קיים
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default UserStatus;
