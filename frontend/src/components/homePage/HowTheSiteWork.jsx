// import react-router-dom
import { Link } from 'react-router-dom';
// import libraries from material-ui
import { Button } from '@mui/material';
// import css
import '../../assets/css/HowTheSiteWork.css';

const HowTheSiteWork = () => {
        return (
                <>
                        <h1>איך האתר עובד?</h1>
                        <div id="bigDivProcessFinding">
                                <div className='processFinding'>
                                        <img src={require('../../assets/images/searchPet.png')} alt="women_img" />
                                        <p>איבדתם את החבר <br></br>הכי טוב שלכם?</p>
                                </div>
                                <img className='arrowStyle' src={require('../../assets/images/left-arrow.png')} alt="women_img" />
                                <div className='processFinding'>
                                        <img src={require('../../assets/images/upload.png')} alt="women_img" />
                                        <p>העלו תמונה <br></br>של בעל החיים לאתר</p>
                                </div>
                                <img className='arrowStyle' src={require('../../assets/images/left-arrow.png')} alt="women_img" />
                                <div className='processFinding'>
                                        <img src={require('../../assets/images/molecular.png')} alt="women_img" />
                                        <p>המערכת שלנו <br></br>תסרוק את מאגר התמונות</p>
                                </div>
                                <img className='arrowStyle' src={require('../../assets/images/left-arrow.png')} alt="women_img" />
                                <div className='processFinding'>
                                        <img src={require('../../assets/images/wanted.png')} alt="women_img" />
                                        <p>יוצגו תמונות של בעלי חיים<br></br> שנמצאו זהים לבעל החיים שלכם</p>
                                </div>
                                <img className='arrowStyle' src={require('../../assets/images/left-arrow.png')} alt="women_img" />
                                <div className='processFinding'>
                                        <img src={require('../../assets/images/lossPet.png')} alt="women_img" />
                                        <p>עברו על התמונות <br></br>ולחצו ליצירת קשר עם האדם המוצא</p>
                                </div>
                                <img className='arrowStyle' src={require('../../assets/images/left-arrow.png')} alt="women_img" />
                                <div className='processFinding'>
                                        <img src={require('../../assets/images/homePet.png')} alt="women_img" />
                                        <p>חזרו עם בעל החיים <br></br>בבטחה הביתה</p>
                                </div>
                        </div>
                        <br></br>
                        <div id="startSearchDiv">
                                <h2>שנתחיל בחיפושים?</h2>
                                <br></br>
                                <Button id="buttonStart" component={Link}
                                        to="/UserStatus"><b>צא לדרך!</b>
                                </Button>
                        </div>
                </>
        );
}

export default HowTheSiteWork;