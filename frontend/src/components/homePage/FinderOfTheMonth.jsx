// import libraries from react
import { useEffect, useState } from "react";
// import libraries from material-ui
import Avatar from "@mui/material/Avatar";
// import css
import '../../assets/css/FinderOfTheMonth.css';
// import axios
import axios from '../../api/axios';
const FINDER_OF_THE_MONTH_URL = '/internalData/finderOfTheMonth';

const FinderOfTheMonth = () => {
        const [userWithMostFoundPets, setUserWithMostFoundPets] = useState(null);
        const [errMassage, setErrMassage] = useState("");

        const fetchData = async () => {
                try {
                        const response = await axios.get(FINDER_OF_THE_MONTH_URL);
                        setUserWithMostFoundPets(response.data);
                } catch (err) {
                        setErrMassage(err.message);
                        console.log(err);
                }
        }

        useEffect(() => {
                fetchData();
        }, []);

        return (
                <div className='divFind'>
                        <h2 className="h2Class">מוצא החודש🏆</h2>
                        {userWithMostFoundPets ? (
                                <article>
                                        {userWithMostFoundPets?.message === "אף משתשמש לא מצא חיות" ? (
                                                <section>
                                                        < Avatar alt="no one" title="no one"
                                                                sx={{ width: '150px', height: '150px', my: -1.5, backgroundColor: '#FF8A00', border: '2px solid #fff', mr: 'auto', ml: 'auto' }} />
                                                        <br />
                                                        <p>אוף! עדיין לא מצאו מישהו החודש</p>
                                                </section>
                                        ) :
                                                <section>
                                                        < Avatar alt="d"
                                                                sx={{ width: '150px', height: '150px', my: -1.5, backgroundColor: '#FF8A00', border: '2px solid #fff', mr: 'auto', ml: 'auto' }}
                                                                src={`https://anonymous-animals.azurewebsites.net/avatar/:${userWithMostFoundPets.userEmail}`} />
                                                        <br />
                                                        {userWithMostFoundPets.userName} מצא הכי הרבה חיות (
                                                        {userWithMostFoundPets.foundPetsCount} חיות נמצאו).
                                                </section>

                                        }

                                </article>
                        ) : (
                                <p>טוען...</p>
                        )}
                        {errMassage && <p>{errMassage}</p>}
                </div>
        );
}
export default FinderOfTheMonth;