'use client'
import { Button, Card, CardBody, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import Page from './txt2img/page'


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
      <div className="text-center">

        <h1>Make insanely beautiful ecards regardless of your design experience.</h1>
        <h4>An AI powered visual expression.</h4>
      </div>
      <Spacer y={20}></Spacer>
      <div>
        <Button color='primary' onPress={handleTxt2img}>{"Get Started"}</Button>
      </div>
    </section>

  )
}
