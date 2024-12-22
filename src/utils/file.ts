import fs from "node:fs";
import path from "path";

const __dirname = path.resolve();

export class FileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "File Error";
  }
}

export const makeFileName = (file: string, ext = "csv") => {
  const now = new Date();
  const formattedDateTime = `${now.getDate().toString().padStart(2, "0")}-${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${now.getFullYear()}_${now
    .getHours()
    .toString()
    .padStart(2, "0")}-${now.getMinutes().toString().padStart(2, "0")}-${now
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
  return `files${path.sep}${file}_${formattedDateTime}.${ext}`;
};

export const saveCoords = (content: string, file: string): string => {
  const fileName = path.join(__dirname, makeFileName(file));

  try {
    fs.writeFileSync(fileName, content); //  NodeJS.ErrnoException
  } catch (error: any) {
    throw new FileError(error.message);
  }

  return fileName;
};

export const delCoords = (fileName: string): boolean => {
  try {
    fs.rmSync(fileName);
  } catch (error: any) {
    throw new FileError(error.message);
  }

  return true;
};

export const createFolder = (folder: string): boolean => {
  try {
    const folderName = path.join(__dirname, folder);
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (error: any) {
    throw new FileError(error.message);
  }

  return true;
};

export const getDirName = () => {
  return __dirname;
};
