export interface JsonFileFormat {
    lastUpdated: string,
    notesCount: number,
    notes: Array<{
        id:string,
        title:string,
        wordCount:number,
        contentMD:string,
        contentHTML:string,
        properties: Record<string, unknown>,
        links:Array<string>,
        lastUpdated:string
    }>
}