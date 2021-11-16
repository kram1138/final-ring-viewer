import fs from "fs";

export async function get() {
    const points = JSON.parse((await fs.promises.readFile(`static/points/points.json`)).toString());
    return { body: points };
}

export async function put({body}) {
    await fs.promises.writeFile(`static/points/points.json`, body);
    return {status: 200};
}