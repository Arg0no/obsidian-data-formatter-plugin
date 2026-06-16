import * as fs from "fs";
import * as path from "path";
import { JsonFileFormat } from "./JsonFileFormat";

export class JsonFileManager {
  constructor(private getPath: () => string) {}

  private get filePath(): string {
    return this.getPath();
  }

  save(data: JsonFileFormat): void {
    const dir = path.dirname(this.filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  delete(targetPath?: string): void {
    const p = targetPath ?? this.filePath;
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
    }
  }

  updatePath(oldPath: string, newPath: string): void {
    if (oldPath === newPath) return;
    this.delete(oldPath);
  }
}