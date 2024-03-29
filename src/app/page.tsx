'use client'
import { Button, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/home.module.css'
import { motion } from "framer-motion"
import { useGenerationContext } from '@/context/generation-context'

export default function Home() {
  const router = useRouter()
  const gContext = useGenerationContext()
  const handleTxt2img = () => {
    //Clear context 
    gContext.setT2iInput(undefined)
    gContext.setT2iOutputs([])
    gContext.setT2iOutputSelectedIndex(0)
    gContext.setOverlayText('')
    gContext.setOverlayImageData(undefined)
    gContext.setI2vInput(undefined)

    router.push('/txt2img')
  }

  return (
    <section className={styles.main}>
      <div className={styles.centerLanding}>
        <h1>Create <span className='italic'>ridonkulous</span></h1>
        <motion.div
          animate={{
            scale: [1, 2, 2, 1, 1],
            rotate: [0, 0, 180, 180, 0],
            borderRadius: ["20%", "20%", "50%", "50%", "20%"],
          }}
        >
          <h1><span className={styles.red}>internet expressions</span></h1>
        </motion.div>
        <Spacer y={28}></Spacer>

        <div><h5>Let us get weird together ¯\_(ツ)_/¯</h5></div>

        <Spacer y={2} />
        <Button size='lg' className={styles.startBtn} onPress={handleTxt2img}><h5>Get Started</h5></Button>
      </div>
    </section >

  )
}