'use client'
import { Button, Card, CardBody, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const handleTxt2vid = (e: any) => {
    router.push('/txt2vid')
  }
  return (
    <section className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card>
        <CardBody>
          <Spacer y={4} />
          <Button color='primary' onPress={handleTxt2vid}>{"Text to Video"}</Button>
          <Spacer y={4} />
          <Button color='primary' isDisabled>{"Text to Image maybe to Video"}</Button>
          <Spacer y={4} />
          <Button color='primary' isDisabled>Gallery</Button>
          <Spacer y={4} />
        </CardBody>
      </Card>
    </section>
  )
}
