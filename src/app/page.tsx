'use client'
import { Button, Card, CardBody, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import Page from './txt2img/page'
import styles from '../styles/home.module.css';

export default function Home() {
  const router = useRouter()
  const handleTxt2vid = (e: any) => {
    router.push('/txt2vid')
  }
  const handleTxt2img = (e: any) => {
    router.push('/txt2img')
  }
  return (
    <section className='flex flex-col items-center justify-center'>
      <div className={styles.title}>
        <h2>Make insanely creative e-cards</h2>
        <Spacer y={2}></Spacer>
        <h5>An AI powered e-card creator</h5>
      </div>
      <Spacer y={16}></Spacer>
      <div>
        <Button color='primary' onPress={handleTxt2img}>{"Get Started"}</Button>
      </div>
    </section >

  )
}