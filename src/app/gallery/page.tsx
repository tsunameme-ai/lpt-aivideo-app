'use client'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Image, Link } from "@nextui-org/react";
import React from "react";

export default function Page() {
    const columns = [
        { name: 'INPUT', uid: "input" },
        { name: 'SVD', uid: "svd" },
        { name: "PIKA", uid: "pika" }
    ];

    const videos = [
        {
            id: '0',
            input: 'https://private-user-images.githubusercontent.com/1466088/295208509-57b2d14a-b86a-4d58-92bd-6ca19a6f9444.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDQ4OTE0NDcsIm5iZiI6MTcwNDg5MTE0NywicGF0aCI6Ii8xNDY2MDg4LzI5NTIwODUwOS01N2IyZDE0YS1iODZhLTRkNTgtOTJiZC02Y2ExOWE2Zjk0NDQucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDExMCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDAxMTBUMTI1MjI3WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9NjUwMzYyODFiMmU2YTcxNmQ1MjYxODZhYzk4MTVkYjIyNmExOGRjZDExMDZkZGEzMzM5ZTY3Nzg5MjQ1ZDE5ZCZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.6xPYD-BJCcCdWBL6BRaaXVRCgCnVOJwhiYp3bzQLGM0',
            svd: 'https://github.com/chunxi/ai-video-playground/assets/1466088/face001d-232d-4ffa-9b59-e56d2e8d24bc',
            pika: 'https://github.com/chunxi/ai-video-playground/assets/1466088/d68c6eb9-3fb0-44bf-8dff-d390a6f095b6',
            pikaPrompt: 'girl taps thighs, moivng head, singing to music, elegantmovements'
        },
        {
            id: '1',
            input: 'https://private-user-images.githubusercontent.com/1466088/295212934-94d4001d-f2b3-4eb8-af39-6740dd11d614.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDQ4OTE0NDcsIm5iZiI6MTcwNDg5MTE0NywicGF0aCI6Ii8xNDY2MDg4LzI5NTIxMjkzNC05NGQ0MDAxZC1mMmIzLTRlYjgtYWYzOS02NzQwZGQxMWQ2MTQucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDExMCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDAxMTBUMTI1MjI3WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9NTY4YWNhMTRmNTEyMTc4NzljODEyOGM3Y2I3OTRlM2JlNTk4ODBmMDYzMTFmOWMwODUzMDkwM2UyMmNhYzI2YyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.d9fATaNTtBHmwCG1IOjtU2HnAzL0FqyenwX4TP3nRRc',
            svd: 'https://private-user-images.githubusercontent.com/1466088/295213272-26dffba8-dad2-4639-86e4-6f68ee1095e0.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDQ4OTE0NDcsIm5iZiI6MTcwNDg5MTE0NywicGF0aCI6Ii8xNDY2MDg4LzI5NTIxMzI3Mi0yNmRmZmJhOC1kYWQyLTQ2MzktODZlNC02ZjY4ZWUxMDk1ZTAubXA0P1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDExMCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDAxMTBUMTI1MjI3WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9MjQxN2QwNDQzYTBmOWFkZGQzZTZjNDRiZmNjMDYxOTc1MjNkNjc1N2E5ZDFmNWVlODBjZTI4NDBiNjA4YjhhMiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.WKRL36EjcQPYn6jYtlj67khFzeLJV0umw0n6Vhi9Fac',
            pika: 'https://private-user-images.githubusercontent.com/1466088/295213396-3e1bb08c-3b4e-4954-a427-3b96902942a7.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDQ4OTE0NDcsIm5iZiI6MTcwNDg5MTE0NywicGF0aCI6Ii8xNDY2MDg4LzI5NTIxMzM5Ni0zZTFiYjA4Yy0zYjRlLTQ5NTQtYTQyNy0zYjk2OTAyOTQyYTcubXA0P1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDExMCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDAxMTBUMTI1MjI3WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9OWY3MTM4Zjk4MzE1MDg2MDdlMzYyZjg0N2JlOTRjYTU4ZGY5MDYwNjkzYjQ3NTUyYjAyZGFiYzI0YzFjYjE1OCZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.9M8B5Ja8NMO7p30USsVTL0f6xLH4whUYnD8BgFHJmiQ',
            pikaPrompt: 'a_male_tennis_player_hitting_the_tennis_ball_with_his_raquet'
        },
        {
            id: '2',
            input: 'https://private-user-images.githubusercontent.com/1466088/295213829-6124384f-33d2-452b-9114-6088ec5946f2.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDQ4OTE0NDcsIm5iZiI6MTcwNDg5MTE0NywicGF0aCI6Ii8xNDY2MDg4LzI5NTIxMzgyOS02MTI0Mzg0Zi0zM2QyLTQ1MmItOTExNC02MDg4ZWM1OTQ2ZjIucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDExMCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDAxMTBUMTI1MjI3WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9MGIxMGE4NWEyYWE1MTNiNTliZGM1NGNlNmI4YjZmY2Q4YTlmZmFkNTQ0ODU0ZTA1MTgzMjIxNGRiNTZlMzc4ZiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.Hiv6OBe7ev0CkStgfF1Wv3zg1qrOKiSYPqPClVreMjs',
            svd: 'https://private-user-images.githubusercontent.com/1466088/295214118-dda7ca88-80c9-4282-ad23-616e2e18c22c.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDQ4OTE0NDcsIm5iZiI6MTcwNDg5MTE0NywicGF0aCI6Ii8xNDY2MDg4LzI5NTIxNDExOC1kZGE3Y2E4OC04MGM5LTQyODItYWQyMy02MTZlMmUxOGMyMmMubXA0P1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDExMCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDAxMTBUMTI1MjI3WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9MWUyOTJlNDRiMzQ5ZmJiZDgwZmJlMmViOTY4NzdjNGE3Zjc2MDUwMjRiYzAxNjg1YzE3YzFmMWI1MTg1YWRiNCZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.wog87y-5xq2qYGUCnJqhmd-wXpOi5O-HOESbrv6ckP4',
            pika: 'https://private-user-images.githubusercontent.com/1466088/295214167-8b8d4e2c-3959-4875-ae59-2014a6b4c183.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDQ4OTE0NDcsIm5iZiI6MTcwNDg5MTE0NywicGF0aCI6Ii8xNDY2MDg4LzI5NTIxNDE2Ny04YjhkNGUyYy0zOTU5LTQ4NzUtYWU1OS0yMDE0YTZiNGMxODMubXA0P1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDExMCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDAxMTBUMTI1MjI3WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9YWQ4YjZjM2MxNjkyNjJiZmFjMGQ1MDQwZTFmNTRkYjg3ZTQwZTg2YzU4MDhkNDE0ZTgxZTNhMzllOTU3NWVmMyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.uZJI5lzrDQphHm_qaUt8nxS6gRsGjfLpWeNpU1yILxg',
            pikaPrompt: 'getting_ready_for_surfing'
        }
    ]

    const renderCell = React.useCallback((videoItem: any, columnKey: any) => {
        switch (columnKey) {
            case "input":
                return (
                    <Link href={videoItem.input} color="primary">Link</Link>
                );
            case "svd":
                return (
                    <Link href={videoItem.svd} color="primary">Link</Link>
                    // <video autoPlay loop style={{ width: '500px', height: '300px' }}>
                    //     <source src={videoItem.svd} />
                    // </video>
                );

            case "pika":
                return (
                    <Link href={videoItem.pika} color="primary">{videoItem.pikaPrompt}</Link>
                );
            default:
                return (
                    <div>
                        <div>{columnKey}</div>
                        <div>{videoItem.pika}</div>
                    </div>
                );
        }
    }, [])
    return (
        <section>
            <h2>Gallery</h2>
            <Table aria-label="Example empty table">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={videos}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
                {/* <TableBody emptyContent={"No rows to display."}>{[]}</TableBody> */}
            </Table>
        </section>
    )
}
