import { HistoryEntry, SensorParameters, Smile, SmileStatus, StatusType } from "../schema";



const LIMITS: [Smile, number][] = [
    [Smile.Sad, 450], // 26%
    [Smile.Neutral, 550], // 32%
    [Smile.Happy, 1700] // ->
]

const determineSmile = (d: number): Smile => {
    const [s, _] = LIMITS.find(([_, limit]) => limit <= d) as [Smile, number];
    return s
}

export const dataToSmile = (data: HistoryEntry, params: SensorParameters | null): SmileStatus => {
    const { t, d, tp } = data;

    const base: Partial<SmileStatus> = { type: StatusType.Smile, temp: tp, percentage: d }
    const percentage = d / 1700;
    return {
        ...base,
        smile: determineSmile(d),
        days: params?.plant.wateringIntervalDays ?? 0,
        amount: params?.plant.xWateringAvgVolumeRequirement.value ?? 0,
        percentage
    } as SmileStatus
}