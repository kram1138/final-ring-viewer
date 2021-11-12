import fs from "fs";

export async function get() {
    const points = JSON.parse((await fs.promises.readFile(`points/points.json`)).toString());
    return { body: points };
}

export async function put({body}) {
    // await fs.promises.writeFile(`points/points.json`, body);
    return {status: 200};
}