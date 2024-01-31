// import libraries from react
import { useState, useEffect } from "react";
// import our components
import sliderData from '../../services/sliderData';
// import css
import '../../assets/css/Slider.css';

const Slider = () => {
  const [recommenders] = useState(sliderData);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const lastIndex = recommenders.length - 1;

    if (index < 0) {
      setIndex(lastIndex);
    }
    if (index > lastIndex) {
      setIndex(0);
    }
  }, [index, recommenders]);

  useEffect(() => {
    let slider = setInterval(() => {
      setIndex(index + 1);
    }, 5000);
    return () => {
      clearInterval(slider);
    };
  }, [index]);

  return (
    <section className="section">
      <div className="title">
        <h2>חברים מספרים</h2>
        <p align="center" className="statMsg">*הנתונים המוצגים אינם אמיתיים</p>
      </div>
      <div className="section-center">
        {recommenders.map((item, indexRecommenders) => {
          const { id, image, name, quote } = item;
          let position = "nextSlide";
          if (indexRecommenders === index) {
            position = "activeSlide";
          }
          if (
            indexRecommenders === index - 1 ||
            (index === 0 && indexRecommenders === recommenders.length - 1)
          ) {
            position = "lastSlide";
          }
          return (
            <article className={`basicArticle ${position}`} key={id}>
              <img src={image} alt={name} className="person-img" />
              <h4>{name}</h4>
              <p className="text">{quote}</p>
            </article>
          );
        })}
        <button className="prev" onClick={() => setIndex(index - 1)}>
          <i className="fa fa-angle-double-left" />
        </button>
        <button className="next" onClick={() => setIndex(index + 1)}>
          <i className="fa fa-angle-double-right" />
        </button>
      </div>
    </section>
  );
};

export default Slider;