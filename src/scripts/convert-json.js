
import { readFile, writeFile } from "fs/promises";

const algsRegions = ["NA", "EMEA", "APAC N", "APAC S", "SA"];

async function load() {
    const data = await Promise.all(
        algsRegions.map(
            region => readFile(`points/${region}.json`).then(points => [points.toString(), region])
        )
    );
    await writeFile("src/libs/points.ts", `
    export const endpoints = {${data.map(([endpoints, region]) => `"${region}": ${endpoints}`).join(",")
        }}
    `);
}

load();

export { };