// import libraries from material-ui
import { Grid } from '@mui/material';
// import our components
import Almog from '../../assets/images/Almog.jpg';
import Ron from '../../assets/images/Ron.jpg';
import Shaika from '../../assets/images/Shaika.jpg';
import AdiLiel2 from '../../assets/images/AdiLiel2.png';
import cat_dog from '../../assets/images/cat_dog.jpg';
import data_dog from '../../assets/images/data_dog.jpg';
import Cards from '../Cards';
// import css
import '../../assets/css/About.css';

const About = () => {
        return (
                <div className="aboutUs">
                        <div className="banner"></div>
                        <h1 >מי אנחנו</h1>
                        <div className="line"></div>
                        <div className="about">
                                <div className="text">
                                        <h3>קצת על האתר</h3>
                                        <p> <img src={cat_dog} alt="cats_dogs" />
                                                הפרויקט נועד לסייע בהשבת בעלי חיים אבודים לבעליהם. האתר מאפשר לאדם אשר מצא או איבד כלב/חתול להעלות תמונה של החיה לאתר וכן למלא פרטים רלוונטיים. התמונות המועלות עוברות עיבוד, מזוהות לפי סוג החיה והגזע שלה ונשמרות במאגר נתונים. במידה ותימצא התאמה בין תמונה המופיעה במאגר החיות האבודות לבין תמונה שהועלתה על ידי הבעלים – תתקבל על כך התראה וניתן יהיה להשיב את החיה לבעליה.
                                                מטרת הפרויקט היא לספק פלטפורמה דרכה ניתן לאתר בעל חיים אבוד ולהשיבו לבעלים באופן נוח וקל לשימוש.
                                        </p>
                                </div>
                        </div>
                        <div className="about">
                                <div className="text">
                                        <h3>אז איך הכל התחיל</h3>
                                        <p className='tr1'>
                                                <img src={data_dog} alt="data_dog" />אנו סטודנטים בשנה ג' בתואר למדעי המידע באוניברסיטת בר אילן. במסגרת פרויקט הגמר בו אנו לוקחים חלק, יצרנו אתר המשלב בין צד לקוח, צד שרת ולמידת מכונה. בחרנו בנושא שקרוב לליבנו, מתוך הכרה בכך שחיפוש אחר בעל חיים אבוד יכול להיות תהליך מתסכל ומייגע. אנו מאמינים כי האתר יכול לסייע באופן משמעותי באיתור בעלי חיים אבודים, ומקווים שהוא ישמש מספר רב של אנשים.
                                        </p>
                                </div>
                        </div>
                        <br /><br />
                        <h1>על הצוות</h1>
                        <div>
                                <Grid container item xs={10} justifyContent="center" sx={{ ml: 'auto', mr: "auto" }}>
                                        <Cards
                                                imageSrc={Almog}
                                                title="אלמוג"
                                                alt="תמונה של אחד ממקימי האתר"
                                                studentName="אלמוג כהן"
                                                studentDescription="סטודנטית שנה ג' בתואר במדעי המידע"
                                                githubLink="https://github.com/almogc95"
                                                linkedinLink="https://www.linkedin.com/in/almog-cohen14/"
                                        />
                                        <Cards
                                                imageSrc={Ron}
                                                title="רון"
                                                alt="תמונה של אחד ממקימי האתר"
                                                studentName="רון אלי"
                                                studentDescription="סטודנט שנה ג' בתואר במדעי המידע"
                                                githubLink="https://github.com/RonEli23"
                                                linkedinLink="https://www.linkedin.com/in/ron-eli-ba47a9226/"
                                        />
                                        <Cards
                                                imageSrc={Shaika}
                                                title="שי"
                                                alt="תמונה של אחד ממקימי האתר"
                                                studentName="שי גפן"
                                                studentDescription="סטודנט שנה ג' בתואר במדעי המידע"
                                                githubLink="https://github.com/shai987"
                                                linkedinLink="https://www.linkedin.com/in/shai-geffen-24373721a/"

                                        />
                                        <Cards
                                                imageSrc={AdiLiel2}
                                                title="עדי ליאל"
                                                alt="תמונה של אחד ממקימי האתר"
                                                studentName="עדי ליאל מימון"
                                                studentDescription="סטודנטית שנה ג' בתואר במדעי המידע"
                                                githubLink="https://github.com/adi-liel"
                                                linkedinLink="https://www.linkedin.com/in/adi-liel-maimon/"
                                        />
                                </Grid>
                        </div>
                </div >
        );
}
export default About;

