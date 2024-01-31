// import react-router-dom
import { Link } from 'react-router-dom';
// import css
import '../../assets/css/ParmFooter.css';
//import image
import pen from '../../assets/images/pen.png';
import email from '../../assets/images/email.png';
import social_media from '../../assets/images/social_media.png';

const ParmFooter = () => {
        return (
                <>
                        <div id="div_position">
                                <div className='position-ContactUs'>
                                        <Link to="/ContactUs">
                                                <figure className='figure_style'>
                                                        <img className='footer_img' src={pen} alt="pen" />
                                                        <figcaption>צרו איתנו קשר</figcaption>
                                                </figure>
                                        </Link>
                                </div>
                                <div className='position-email'>
                                        <a href="mailto:findmyfriend10@gmail.com">
                                                <figure className='figure_style'>
                                                        <img className='footer_img' src={email} alt="pen" />
                                                        <figcaption>כתבו לנו</figcaption>
                                                </figure>
                                        </a>
                                </div>
                                <div className='position-social_media'>
                                        <a href="https://github.com/shai987/find_my_friend" target="_blank" rel="noopener noreferrer">
                                                <figure className='figure_style'>
                                                        <img className='footer_img' src={social_media} alt="pen" />
                                                        <figcaption>חפשו אותנו ברשתות החברתיות</figcaption>
                                                </figure>
                                        </a>
                                </div>

                        </div>
                        <span className='copyright'>
                                <br></br>
                                Copyright ©  Find My Friend{' ' + new Date().getFullYear()}
                        </span>
                </>
        );
}

export default ParmFooter;