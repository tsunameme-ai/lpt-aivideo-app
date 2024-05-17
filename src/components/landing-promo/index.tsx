import styles from '@/styles/home.module.css'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Image } from '@nextui-org/react'


const LandingPromoComponent = () => {
    const sliderGIFSettings = {
        dots: false,
        slieToScroll: 1,
        slidesToShow: 1,
        vertical: false,
        initialSlide: 0,
        rows: 1,
        slidesPerRow: 2,
        autoplaySpeed: 2000,
        autoplay: true,
        speed: 2500,
        arrows: false,
        responsive: [
            {
                breakpoint: 501,
                settings: {
                    slidesPerRow: 2,
                    rows: 2,
                }
            }
        ]
    }
    const imgs = ['https://lpt-aivideo-dst.s3.amazonaws.com/kQu1NZFLKj.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/E5J8VQLt1X.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/76j6cry4Dk.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/rntakIi0Sp.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/2EpWdnt4mv.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/b410c61Xiw.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/qo198RafvM.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/uLacJWG3y9.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/tUH3FrFYD9.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/Ir4l2Q7Sva.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/A7kXSaj0ec.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/1Pt2iQCG5K.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/qElP3G9NwO.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/amwYmgjyTU.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/KGwZxKAw4u.gif',
        'https://lpt-aivideo-dst.s3.amazonaws.com/riJglKynzV.gif',
    ]

    return (
        <Slider className={styles.slider} {...sliderGIFSettings}>
            {
                imgs.map((img, index) => {
                    return <div key={index}><Image loading='lazy' radius='sm' src={img} alt='' /> </div >
                })
            }
        </Slider >
    )
}

export default LandingPromoComponent