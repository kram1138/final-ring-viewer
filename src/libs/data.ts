import { fromPairs } from "lodash-es";

export const regions = ["NA", "EMEA", "APAC N", "APAC S", "SA", "Div B"];
export const algsRegions = ["NA", "EMEA", "APAC N", "APAC S", "SA"];

export type Endpoint = {
    pointX?: number;
    pointY?: number;
    circleX?: number;
    circleY?: number;
    color?: string;
    description: string;
};

export async function loadAll(fetch: (info: RequestInfo) => Promise<Response>): Promise<Record<string, Endpoint[]>> {
    return Promise.all(
        regions.map((region) =>
            fetch(`/points/${region}`)
                .then((r) => r.json())
                .then((ps) => [region, ps])
        )
    ).then(fromPairs);
}
