import { laptopOutline, optionsOutline, printOutline, scanCircleOutline, tvOutline, wifiOutline } from "ionicons/icons";


export function iconRepair(val: string) {
    const iconList = {
        'Komputer': tvOutline,
        'Printer': printOutline,
        'Scanner': scanCircleOutline,
        'Laptop': laptopOutline,
        'Jaringan': wifiOutline,
        'Lainya': optionsOutline
    }

    return iconList[val as 'Komputer' | 'Printer' | 'Scanner' | 'Laptop' | 'Jaringan' | 'Lainya'];
}
export function imgBaseUrl<T extends { collectionId: string, id: string }>(row: T, img: string | undefined) {
    return `${process.env.REACT_APP_POCKETBASE_URL}/api/files/${row.collectionId}/${row.id}/${img}`
}