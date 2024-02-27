'use client'
import { Button, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/home.module.css'

export default function Home() {
  const router = useRouter()
  const handleTxt2img = () => {
    router.push('/txt2img')
  }
  return (
    <section className='flex flex-col items-center justify-center'>
      <div className={styles.centerLanding}>
        <h1>Create <span className='italic'>ridonkulous</span> <span className={styles.red}>internet expressions</span></h1>
        <Spacer y={28}></Spacer>
      </div>
      <h5>Let us get weird together ¯\_(ツ)_/¯</h5>
      <Spacer y={2} />
      <div className={styles.promptControls}>
        <Button size='lg' className={styles.nextBtn} onPress={handleTxt2img}><h5>Get Started</h5></Button>
      </div>
    </section >

  )
}