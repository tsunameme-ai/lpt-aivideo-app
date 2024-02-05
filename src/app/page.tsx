'use client'
import { Button, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import styles from '../styles/home.module.css'

export default function Home() {
  const router = useRouter()
  const handleTxt2img = () => {
    router.push('/txt2img')
  }
  return (
    <section className='flex flex-col items-center justify-center'>
      <div className={styles.centerSection}>
        <h2>Make insanely <span className={styles.red}> creative</span> e-cards</h2>
        <Spacer y={2}></Spacer>
        <h5>An AI powered e-card creator</h5>

        <Spacer y={16}></Spacer>

        <Button color='primary' onPress={handleTxt2img}>{"Get Started"}</Button>
      </div>
    </section >

  )
}