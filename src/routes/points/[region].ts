import { readFile, writeFile } from "fs/promises";

export async function get({params}) {
    const points = JSON.parse((await readFile(`points/${params.region}.json`)).toString());
    return { body: points };
}

export async function put({body, params}) {
    await writeFile(`points/${params.region}.json`, body);
    return {status: 200};
}