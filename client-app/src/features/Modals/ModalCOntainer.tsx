import { observer } from "mobx-react-lite";
import { Modal, ModalContent } from "semantic-ui-react";
import { useStore } from "../../layout/Stores/Store";

export default observer(function ModalContainer() {
    const { modalStore } = useStore();
    return (
        <Modal open={modalStore.Modal.open}
            onClose={modalStore.closeModal}
            size='mini'>
            <ModalContent>
                {modalStore.Modal.body}
            </ModalContent>
        </Modal>
    )
})