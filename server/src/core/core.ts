import { HistoryEntry, SensorParameters, Smile, SmileStatus, StatusType } from "../schema";



export const dataToSmile = (data: HistoryEntry, params: SensorParameters | null): SmileStatus => {
    const { t, d, tp } = data;

    const base: Partial<SmileStatus> = { type: StatusType.Smile, temp: tp, percentage: d }

    return {
        ...base,
        percentage: d,
        smile: Smile.Happy
    } as SmileStatus
}