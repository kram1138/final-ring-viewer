import fs from "fs";

export async function get({params}) {
    const points = JSON.parse((await fs.promises.readFile(`points/${params.region}.json`)).toString());
    return { body: points };
}

export async function put({body, params}) {
    await fs.promises.writeFile(`points/${params.region}.json`, body);
    return {status: 200};
}