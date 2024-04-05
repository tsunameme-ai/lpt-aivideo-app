'use client'
import { Button, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/home.module.css'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useGenerationContext } from '@/context/generation-context'
//import MediaPlayerComponent from "@/components/media-player"

export default function Home() {
  const router = useRouter()
  const gContext = useGenerationContext()
  const handleTxt2img = () => {
    //Clear context 
    gContext.reset()

    router.push('/txt2img')
  }
  /*
  const imageOutputs = [
  ]*/

  const sliderGIFSettings = {
    dots: false,
    slieToScroll: 1,
    slidesToShow: 1,
    vertical: false,
    initialSlide: 0,
    rows: 2,
    slidesPerRow: 2,
    autoplaySpeed: 3000,
    autoplay: true,
    speed: 3000,
  }

  return (
    <section className={styles.main}>
      <div className={styles.centerLanding}>
        <div className='text-[20px]'>Making GIF expressions</div>
        <div className='text-[20px]'>with <span className={styles.red}>generative AI</span></div>
        <Spacer y={8} />
        <Slider className={styles.slider} {...sliderGIFSettings}>
          <div key={0}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/EtXjqe36bZ.gif' /></div>
          <div key={1}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/E5J8VQLt1X.gif' /></div>
          <div key={2}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/jJ5VujUbMn.gif' /></div>
          <div key={3}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/GH1Exd8DcI.gif' /></div>
          <div key={4}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/ofw4eSWITF.gif' /></div>
          <div key={5}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/b410c61Xiw.gif' /></div>
          <div key={6}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/qo198RafvM.gif' /></div>
          <div key={7}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/uLacJWG3y9.gif' /></div>
          <div key={8}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/tUH3FrFYD9.gif' /></div>
          <div key={9}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/Ir4l2Q7Sva.gif' /></div>
          <div key={10}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/A7kXSaj0ec.gif' /></div>
          <div key={11}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/d3SUEx6JZS.gif' /></div>
          <div key={12}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/qElP3G9NwO.gif' /></div>
          <div key={13}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/amwYmgjyTU.gif' /></div>
          <div key={14}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/KGwZxKAw4u.gif' /></div>
          <div key={15}><img src='https://lpt-aivideo-dst.s3.amazonaws.com/riJglKynzV.gif' /></div>
        </Slider>
        <div className='text-[12px]'>Selctions from the community</div>
        <Spacer y={20} />
        <Button size='lg' className={styles.startBtn} onPress={handleTxt2img}><div className='text-[20px]'>Get Started</div></Button>
      </div >
    </section >

  )
}