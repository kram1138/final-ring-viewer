
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
    winner?: string;
};

export type EndpointMarker = {
    pointX?: number;
    pointY?: number;
    circleX?: number;
    circleY?: number;
    color: string;
    tooltip: string;
};

export type Point = {
    x: number;
    y: number;
}

export async function loadAll(fetch: (info: RequestInfo) => Promise<Response>): Promise<GroupInfo[]> {
    return fetch(`/points`).then((r) => r.json());
}

export async function saveAll(fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>, groups: GroupInfo[]): Promise<Response> {
    return fetch(`/points`, {
        method: "PUT",
        body: JSON.stringify(groups),
    });
}

export function updateGroupInGroups(groups: GroupInfo[]): (group: GroupInfo) => GroupInfo[] {
    return (groupToUpdate) => groups.map(group => group.description === groupToUpdate.description ? groupToUpdate : group);
}

export function updateMatchInGroups(groups: GroupInfo[]): (group: GroupInfo, match: MatchInfo) => GroupInfo[] {
    return (groupToUpdate, matchToUpdate) => groups.map(group => group.description === groupToUpdate.description ? {
        ...group,
        matches: group.matches.map(match => match.description === matchToUpdate.description ? matchToUpdate : match)
    } : group);
}

export function toMarker(color: string, group: string, match: string) {
    return (point: Endpoint, index: number): EndpointMarker => ({
        ...point,
        color,
        tooltip: `${group}, ${match}, Game ${index + 1}${point.winner?.length ? ", Winner: " + point.winner : ""}`,
    });
}

export function groupsToPoints(groups: GroupInfo[]) {
    return groups.flatMap(({ matches, description: group, color }) =>
        matches.flatMap(({ games, description: match }) =>
            games.map(toMarker(color, group, match))
        )
    )
}
