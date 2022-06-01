import {Actor} from "../types/actor";
import {UploadedFile} from "express-fileupload";
import {deleteFile, getDownloadUrl, uploadFile} from "./storageService";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where
} from "firebase/firestore";
import {db} from "../firebase/app";
import {deleteByActorId as deleteCharactersByActorId} from "./characterService";
import {getUpperConstraint} from "../utils/search";
import {QueryConstraint} from "@firebase/firestore";

export const create = async (newActor: Actor, profile?: UploadedFile): Promise<Actor> => {
    let profileUrl;
    if (profile) {
        profileUrl = await uploadFile(profile, 'images/profiles/').then(profileFile => {
            return getDownloadUrl(`images/profiles/${profileFile}`)
        });
    }
    const actor: Omit<Actor, 'id'> = {
        ...newActor,
        profile: profileUrl || '',
    }

    const docRef = await addDoc(collection(db, 'actors'), actor);

    return {
        id: docRef.id,
        ...actor
    }
};

export const update = async (actor: Actor, profile?: UploadedFile): Promise<Actor> => {
    if (!actor.id) {
        throw new Error('Actor does not have id field');
    }
    const actorRef = doc(db, 'actors', actor.id);
    const actorSnap = await getDoc(actorRef);

    if (!actorSnap.exists()) {
        throw new Error('Actor was not found');
    }

    let profileUrl;
    if (profile) {
        const oldProfileUrl = actorSnap.data().profile;
        if (oldProfileUrl) {
            deleteFile(oldProfileUrl);
        }
        profileUrl = await uploadFile(profile, 'images/profiles/').then(profileFile => {
            return getDownloadUrl(`images/profiles/${profileFile}`)
        });
    }

    const {id, ...updateData} = actor;
    if (profileUrl) {
        updateData.profile = profileUrl;
    }
    await updateDoc(actorRef, updateData as Omit<Actor, 'id'>);

    return {
        ...actor,
        profile: profileUrl ?? actorSnap.data().profile,
    };
};

export const getById = async (id: string): Promise<Actor | null> => {
    const actorRef = doc(db, 'actors', id);
    const actorSnap = await getDoc(actorRef);

    if (!actorSnap.exists()) {
        return null;
    }

    return {
        ...actorSnap.data() as Omit<Actor, 'id'>,
        id,
    }
};

export const getAll = async (name?: string): Promise<Actor[]> => {
    const queryConstraints: QueryConstraint[] = [];
    if (name) {
        queryConstraints.push(where('name', '>=', name));
        queryConstraints.push(where('name', '<', getUpperConstraint(name)));
    }

    const q = query(collection(db, 'actors'), ...queryConstraints, orderBy('name'));
    const actorsSnap = await getDocs(q);

    const actors: Actor[] = [];
    actorsSnap.forEach(doc => {
        actors.push({
            id: doc.id,
            name: doc.data().name,
            profile: doc.data().profile,
        } as Actor);
    });
    return actors;
};

export const deleteById = async (id: string): Promise<boolean> => {
    const actor = await getById(id);
    if (!actor) {
        return false;
    }
    if (actor.profile) {
        deleteFile(actor.profile);
    }
    deleteCharactersByActorId(id);
    await deleteDoc(doc(db, 'actors', id));
    return true;
};
