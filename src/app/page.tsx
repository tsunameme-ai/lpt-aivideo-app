'use client'
import { Button, Card, CardBody, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const handleTxt2vid = (e: any) => {
    router.push('/txt2vid')
  }
  const handleTxt2img = (e: any) => {
    router.push('/txt2img')
  }
  return (
    <section>
      <Card>
        <CardBody>
          {/* <Spacer y={4} />
          <Button color='primary' onPress={handleTxt2vid}>{"Text to Video"}</Button> */}
          <Spacer y={4} />
          <Button color='primary' onPress={handleTxt2img}>{"Text to Image to Video"}</Button>
          <Spacer y={4} />
        </CardBody>
      </Card>
    </section>
  )
}
