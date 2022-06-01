import {UploadedFile} from "express-fileupload";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../firebase/app";

export const uploadFile = async (file: UploadedFile, path: string): Promise<string> => {
    const filename = Math.random().toString(36).substring(2);
    const fileExt = file.name.split('.').pop();
    const targetFilename = filename + '.' + fileExt;
    const fileRef = ref(storage, path + targetFilename);
    await uploadBytes(fileRef, file.data);

    return targetFilename;
};

export const deleteFile = async (filename: string): Promise<void> => {
    const fileRef = ref(storage, filename);
    await deleteObject(fileRef);
};

export const getDownloadUrl = async (filename: string): Promise<string> => {
    const fileRef = ref(storage, filename);
    return await getDownloadURL(fileRef);
};