'use client'


export default function Page({ params }: { params: { vid: string, asset: string } }) {
    console.log(`Asset view $`)

    return (
        <>
            <h1>{`Asset ${params.asset} ${params.vid}`}</h1>
            <small>Under construction</small>
        </>
    )
}