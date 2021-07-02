export enum AbmFilePathType {
    IMAGE,
    BABYLON,
    ECHARTS,
    SBM,
    JS,
    DATA,
    MOCK,
    FONT,
    THEME,
}

export class AbmFilePaths {
    private static filePathMap: Map<AbmFilePathType | string, string> = new Map([
        [AbmFilePathType.IMAGE, 'assets/images/'],
        [AbmFilePathType.BABYLON, 'assets/models/babylon/'],
        [AbmFilePathType.ECHARTS, 'assets/echarts/'],
        [AbmFilePathType.SBM, 'assets/models/SBM/'],
        [AbmFilePathType.JS, 'assets/js/'],
        [AbmFilePathType.DATA, 'assets/data/'],
        [AbmFilePathType.MOCK, 'assets/mock/'],
        [AbmFilePathType.FONT, 'assets/font'],
        [AbmFilePathType.THEME, 'assets/themes'],
    ]);

    public static setPath(type: AbmFilePathType | string, path: string): string | undefined {
        const existPath = AbmFilePaths.filePathMap.get(type);

        AbmFilePaths.filePathMap.set(type, path);

        return existPath;
    }

    public static getPath(type: AbmFilePathType | string): string {

        const path = AbmFilePaths.filePathMap.get(type);

        if (!path) {
            throw new Error('Path is empty for type:' + type);
        }

        return path;
    }

}
