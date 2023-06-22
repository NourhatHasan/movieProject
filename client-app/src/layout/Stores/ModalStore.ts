import { makeAutoObservable, runInAction } from "mobx";
import { JSX } from "react/jsx-runtime";

interface Modal {
    body: null | JSX.Element;
    open: boolean;
}

export default class modalStore {
    static openModal(arg0: JSX.Element): void {
        throw new Error("Method not implemented.");
    }
    Modal: Modal = {
        open: false,
        body: null

    }
    constructor() {
        makeAutoObservable(this)
    }



    openModal = (form: JSX.Element) => {
        this.Modal.body = form;
        this.Modal.open = true;
    }

    closeModal = () => {
        this.Modal.body = null;
        this.Modal.open = false;
    }


}