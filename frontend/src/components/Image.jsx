const Image = (props) => {
        const { src, alt, title, style } = props.img;
        return (
                <img src={src} alt={alt} title={title} style={style} />
        );
}
export default Image;