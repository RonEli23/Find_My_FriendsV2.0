// import libraries from react
import { useState, useEffect, useCallback } from 'react';
// import images
import running_dog1 from './../assets/images/dog_running_loader1.gif';
import running_dog2 from './../assets/images/dog_running_loader2.gif';
import running_cat1 from './../assets/images/cat_running_loader1.gif';
import running_cat2 from './../assets/images/cat_running_loader2.gif';
// import css
import './../assets/css/Loader.css';

const Loader = () => {
  const [gifLoader, setGifLoader] = useState();

  // Used to stored in memory getLoaderGif function and ensure it doesn't change on every render, except when the loadingArray changes.
  const getLoaderGif = useCallback(() => {
    const loadingArray = [running_dog1, running_dog2, running_cat1, running_cat2];
    const randomIndex = Math.floor(Math.random() * loadingArray.length);
    return loadingArray[randomIndex];
  }, []);

  // Ensures that gifLoader state update with a random GIF from loadingArray whenever getLoaderGif changes.
  useEffect(() => {
    setGifLoader(getLoaderGif());
  }, [getLoaderGif]);

  return (
    <>
      <div className="preloader">
        <h2>
          <img src={gifLoader} alt="loading" />
          בטעינה...
        </h2>
      </div>
    </>
  );
}

export default Loader;