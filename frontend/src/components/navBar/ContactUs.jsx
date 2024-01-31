// import libraries from react
import { useState } from "react";
// import libraries from material-ui
import Alert from '@mui/material/Alert';
// import images
import dog_computer from '../../assets/images/dog_computer.jpg';
// import css
import '../../assets/css/ContactUs.css';
// import axios
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8080/route';

const ContactForm = () => {
  const initialFormData = {
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    message: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formStatus, setFormStatus] = useState('שלח טופס');
  const [textErr, setText] = useState("");
  const [flag, setFlag] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [firstNameErr, setFirstNameErr] = useState(false);
  const [lastNameErr, setLastNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [msgErr, setMsgErr] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('שולח...');
    setFirstNameErr(false);
    setLastNameErr(false);
    setEmailErr(false);
    setMsgErr(false);

    if (!formData.userFirstName || !formData.userLastName || !formData.userEmail || !formData.message) {
      setFlag(true);
      setAlertType("error");
      setText("אוי! אחד מהשדות ריקים");
      return;
    }

    const details = {
      userFirstName: formData.userFirstName,
      userLastName: formData.userLastName,
      userEmail: formData.userEmail,
      message: formData.message
    };

    try {
      const response = await axios.post("/contact", details, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });

      // Reset the button text
      setFormStatus('שלח טופס');
      const result = response.data;

      if (result.status === "Message Sent") {
        setFlag(true);
        setAlertType("success");
        setText("איזה כיף! המייל נשלח בהצלחה!");
        setFormData(initialFormData);
      }

    } catch (error) {
      // Handle error here
      setAlertType("error");
      handleErrors(error);
    }
  };

  const handleErrors = (err) => {
    setFlag(true)
    if (err.response?.data && err.response?.data.errors) {
      // Handle validation errors
      const errors = err.response.data.errors;
      console.log(errors);
      let errMsg = "";

      if (errors.length > 1) {
        for (let error of errors) {
          const errorMsg = error.msg;
          console.log(error.param);
          if (error.param === "userFirstName") {
            setFirstNameErr(true);
            errMsg += `${errorMsg}\n`;
          }
          else if (error.param === "userLastName") {
            setLastNameErr(true);
            errMsg += `${errorMsg}\n`;
          }
          else if (error.param === "userEmail") {
            setEmailErr(true);
            errMsg += `${errorMsg}\n`;
          }
          //message
          else {
            setMsgErr(true);
            errMsg += `${errorMsg}\n`;
          }
        }
      }
      else {
        if (errors[0].param === "userFirstName") {
          setFirstNameErr(true);
        }
        else if (errors[0].param === "userLastName") {
          setLastNameErr(true);
        }
        else if (errors[0].param === "userEmail") {
          setEmailErr(true);
        }
        //message
        else {
          setMsgErr(true);
        }
        errMsg = errors[0].msg;
      }
      setText(errMsg);
    } else {
      // Handle generic error
      setText(["אופס! משהו השתבש"]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="contactUs" dir="rtl">
      <div className="baner"></div>
      <h1>צור קשר</h1>
      <div className="line"></div>
      <p>
        מוזמנים לפנות אלינו כדי לשתף, לחוות דעה, להעלות בעיות או בכל עניין אחר
      </p>
      <section className="contact_wrapper">
        <div className="form_contact">
          <form onSubmit={onSubmit}>
            {flag && (
              <div>
                <br></br>
                <br></br>{" "}
                <Alert severity={alertType} sx={{ whiteSpace: "pre-line", width: "70%" }}>
                  {textErr}
                </Alert>
                <br></br>
                <br></br>
              </div>
            )}
            <input
              type="text"
              id="userFirstName"
              name="userFirstName"
              placeholder="שם פרטי"
              required
              value={formData.userFirstName}
              onChange={handleChange}
              className={firstNameErr ? "errorMsg" : ""}
            />
            <input
              type="text"
              id="userLastName"
              name="userLastName"
              placeholder="שם משפחה"
              required
              value={formData.userLastName}
              onChange={handleChange}
              className={lastNameErr ? "errorMsg" : ""}
            />
            <input
              type="email"
              placeholder="אימייל"
              id="userEmail"
              name="userEmail"
              required
              value={formData.userEmail}
              onChange={handleChange}
              className={emailErr ? "errorMsg" : ""}
            />
            <textarea
              cols="30"
              rows="10"
              placeholder="תוכן ההודעה"
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              className={msgErr ? "errorMsg" : ""}
            />
            <button type="submit">{formStatus}</button>
          </form>
        </div>
        <div className="dog_image">
          <img src={dog_computer} alt="dog_phone" />
        </div>
      </section>
    </div>
  );
};

export default ContactForm;

