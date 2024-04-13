import styles from '@/styles/home.module.css'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Spacer, Image } from '@nextui-org/react'


const LandingPromoComponent = () => {
    const sliderGIFSettings = {
        dots: false,
        slieToScroll: 1,
        slidesToShow: 1,
        vertical: false,
        initialSlide: 0,
        rows: 2,
        slidesPerRow: 2,
        autoplaySpeed: 2000,
        autoplay: true,
        speed: 2500,
        arrows: false
    }

    return (
        <>
            <div className='text-[20px]'>Making GIF expressions</div>
            <div className='text-[20px]'>with <span className={styles.red}>generative AI</span></div>
            <Spacer y={8} />
            <Slider className={styles.slider} {...sliderGIFSettings}>
                <div key={0}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/EtXjqe36bZ.gif' alt='' /> </div>
                <div key={1}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/E5J8VQLt1X.gif' alt='' /></div>
                <div key={2}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/jJ5VujUbMn.gif' alt='' /></div>
                <div key={3}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/GH1Exd8DcI.gif' alt='' /></div>
                <div key={4}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/ofw4eSWITF.gif' alt='' /></div>
                <div key={5}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/b410c61Xiw.gif' alt='' /></div>
                <div key={6}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/qo198RafvM.gif' alt='' /></div>
                <div key={7}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/uLacJWG3y9.gif' alt='' /></div>
                <div key={8}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/tUH3FrFYD9.gif' alt='' /></div>
                <div key={9}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/Ir4l2Q7Sva.gif' alt='' /></div>
                <div key={10}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/A7kXSaj0ec.gif' alt='' /></div>
                <div key={11}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/d3SUEx6JZS.gif' alt='' /></div>
                <div key={12}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/qElP3G9NwO.gif' alt='' /></div>
                <div key={13}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/amwYmgjyTU.gif' alt='' /></div>
                <div key={14}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/KGwZxKAw4u.gif' alt='' /></div>
                <div key={15}><Image radius='sm' src='https://lpt-aivideo-dst.s3.amazonaws.com/riJglKynzV.gif' alt='' /></div>
            </Slider>
            <div className='text-[12px]'>Collections from the community</div>
        </>
    )
}

export default LandingPromoComponent