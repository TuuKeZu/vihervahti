import { HistoryEntry, SensorParameters, Smile, SmileStatus, StatusType } from "../schema";



export const dataToSmile = (data: HistoryEntry, params: SensorParameters | null): SmileStatus => {
    const { t, d, tp } = data;

    const base: Partial<SmileStatus> = { type: StatusType.Smile, temp: tp, percentage: d }
    const percentage = d / 1700;
    return {
        ...base,
        smile: Smile.Sad,
        days: params?.plant.wateringIntervalDays ?? 0,
        amount: params?.plant.xWateringAvgVolumeRequirement.value ?? 0,
        percentage
    } as SmileStatus
}