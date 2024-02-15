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

        <h2>Make ridiculous <span className={styles.red}>artificial expressions</span></h2>
        <Spacer y={4}></Spacer>
        <h5>Let us get weird together ¯\_(ツ)_/¯</h5>
        <Spacer y={16}></Spacer>
        <Button size='lg' color='primary' onPress={handleTxt2img}>{"Get Started"}</Button>

      </div>
    </section >

  )
}