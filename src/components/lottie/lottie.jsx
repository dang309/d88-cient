import PropTypes from 'prop-types'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Lottie = ({src}) => <DotLottieReact src={src} loop autoplay />;

Lottie.propTypes = {
    src: PropTypes.string
}

export default Lottie;
