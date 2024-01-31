// import libraries from react
import { useContext, useState } from "react";
// import react-router-dom
import { Link, useLocation } from 'react-router-dom';
// import our components
import Image from '../Image';
import { UserRequestContext } from "../../context/UserRequestContext";
// import css
import '../../assets/css/NoResults.css';

const NoResults = () => {
        const { request } = useContext(UserRequestContext);
        const location = useLocation();
        const [petType] = useState(location.state.petType);

        const status = request.status;

        const cat = {
                src: require('../../assets/images/cat-sitting-alone.jpg'),
                alt: "Sad cat img",
                title: "Sad cat img",
                style: {
                        height: '300px',
                        width: '400px',
                }
        }

        const dog = {
                src: require('../../assets/images/sad_dog.jpg'),
                alt: "Sad dog img",
                title: "Sad dog img",
                style: {
                        height: '300px',
                        width: '400px',
                }
        }

        let text = status === "lost" ? "לצערנו לא נמצאה התאמה! אתם מוזמנים לנסות ולחפש שוב במועד מאוחר יותר" :
                "לצערנו לא נמצאה התאמה! תודה רבה על מאמצכם, במידה ותהיה התאמה בהמשך, הורי החיה יצרו עמכם קשר";

        return (
                <div className="basic">
                        <p>{text}</p>
                        <Image img={petType === "cat" ? cat : dog} />
                        <br></br>
                        <Link to="/UserAccount">
                                <button className="buttonMoveToUserAccount" >
                                        <b>למעבר לאזור האישי</b>
                                </button>
                        </Link>
                </div>
        );
}
export default NoResults;