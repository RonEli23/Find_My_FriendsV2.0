// import libraries from material-ui
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/material';
// import libraries from react-icons
import { FaGithub, FaLinkedin } from 'react-icons/fa';
// import prop-types
import PropTypes from 'prop-types';

const Cards = (props) => {
        return (
                <>
                        <Card sx={{ maxWidth: 245 }}>
                                <CardMedia
                                        sx={{
                                                width: '100%',
                                                height: '60%',
                                        }}
                                        image={props.imageSrc}
                                        title={props.title}
                                        alt={props.alt}
                                        component='img'
                                />
                                <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                                {props.studentName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                                {props.studentDescription}
                                        </Typography>
                                </CardContent>
                                <CardActions>
                                        <div className='divIcons'>
                                                <Link className='icon' sx={{ color: 'black', fontSize: 25 }} href={props.githubLink} target="_blank" rel="noopener noreferrer" >
                                                        <FaGithub />
                                                </Link>
                                                &nbsp;
                                                <Link className='icon' color="primary" sx={{ fontSize: 25 }} href={props.linkedinLink} target="_blank" rel="noopener noreferrer" >
                                                        <FaLinkedin />
                                                </Link>
                                        </div>
                                </CardActions>
                        </Card>
                        &nbsp; &nbsp;
                </>
        );
}

Cards.propTypes = {
        imageSrc: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
        studentName: PropTypes.string.isRequired,
        studentDescription: PropTypes.string.isRequired,
        githubLink: PropTypes.string.isRequired,
        linkedinLink: PropTypes.string.isRequired,
}

export default Cards; 