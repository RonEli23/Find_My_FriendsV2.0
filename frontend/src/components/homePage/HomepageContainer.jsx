// import our components
import Welcome from "./Welcome";
import FinderOfTheMonth from "./FinderOfTheMonth";
import Slider from "./Slider";
import Statistics from "./Statistics";
import HowTheSiteWork from "./HowTheSiteWork";

const HomepageContainer = () => {
        return (
                <div className="HomepageContainer">
                        <>
                                <Welcome />
                                <br />
                                <br />
                                <HowTheSiteWork />
                                <br />
                                <br />
                                <br />
                                <Statistics />
                                <Slider />
                                <FinderOfTheMonth />
                        </>
                </div >
        );
};

export default HomepageContainer;