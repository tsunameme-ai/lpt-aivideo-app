'use client'
import { Button, Card, CardBody, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const handleTxt2img = () => {
    router.push('/txt2img')
  }
  return (
    <section>
      <Card>
        <CardBody>
          <Spacer y={4} />
          <Button color='primary' onPress={handleTxt2img}>{"Text to Image to Video"}</Button>
          <Spacer y={4} />
        </CardBody>
      </Card>
    </section>
  )
}
