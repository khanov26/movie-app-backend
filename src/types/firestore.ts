import firebase from "firebase/compat";
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import OrderByDirection = firebase.firestore.OrderByDirection;

export interface FirestoreFilter {
    field: string;
    comparison: WhereFilterOp;
    value: number | string | string[];
}

export interface FirestoreOrder {
    field: string;
    direction?: OrderByDirection;
}
