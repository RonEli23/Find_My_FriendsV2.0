// import our components
import Image from '../Image';

const Welcome = () => {
        const image = {
                src: require('../../assets/images/welcome7.jpg'),
                alt: "dog&cat_image",
                title: "Find my friend banner",
                style: {
                        width: '100vw',
                }
        }
        return (
                <div>
                        <Image img={image} />
                </div>
        );
}

export default Welcome;