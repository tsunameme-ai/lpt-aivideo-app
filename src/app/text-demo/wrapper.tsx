
'use client'
import Editor from "@/components/editor";
import { useRef } from "react";

const EditorWrapper: React.FC = () => {
    const ref = useRef<any>()
    return <>
        <Editor
            imageUrl="https://storage.googleapis.com/livepeer-ai-video-dev/e7d1c27a/c5af4d0b.png"
            stageRef={ref}
        />
    </>
}
export default EditorWrapper