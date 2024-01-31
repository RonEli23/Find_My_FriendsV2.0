// import libraries from material-ui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
// import our components
import ParmFooter from './ParmFooter';
import ScrollToTop from "./ScrollToTop";

const Footer = () => {
        return (
                <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', mt: '-400px' }}>
                                <CssBaseline />
                                <Box component="footer"
                                        sx={{
                                                py: 1,
                                                px: 2,
                                                mt: 'auto',
                                                backgroundColor: '#333333'

                                        }}
                                >
                                        <Container maxWidth="sm">
                                                <ParmFooter />
                                        </Container>
                                </Box>
                        </Box>
                        <ScrollToTop />
                </>
        );
}
export default Footer;