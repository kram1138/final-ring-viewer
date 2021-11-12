
export type GroupInfo = {
    description: string;
    color: string;
    matches: MatchInfo[];
}

export type MatchInfo = {
    description: string;
    games: Endpoint[];
}

export type Endpoint = {
    pointX?: number;
    pointY?: number;
    circleX?: number;
    circleY?: number;
};

export type EndpointMarker = {
    pointX?: number;
    pointY?: number;
    circleX?: number;
    circleY?: number;
    color: string;
    tooltip: string;
};

export async function loadAll(fetch: (info: RequestInfo) => Promise<Response>): Promise<GroupInfo[]> {
    return fetch(`/points`).then((r) => r.json());
}
