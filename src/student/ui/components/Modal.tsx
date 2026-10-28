import { useEffect, useRef, type PropsWithChildren } from "react";

interface ModalProps {
	open: boolean;
	closeOnEscape?: boolean;
	onClose?: VoidFunction;
}

export default function Modal({
	open = false,
	closeOnEscape = true,
	onClose = () => {},
	children,
}: PropsWithChildren<ModalProps>) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	useEffect(() => {
		if (!!open) {
			document.body.classList.add("overflow-hidden");
			dialogRef?.current?.showModal();
		} else {
			document.body.classList.remove("overflow-hidden");
			dialogRef.current?.close();
		}
	}, [open]);

	return (
		<dialog
			ref={dialogRef}
			className="backdrop:bg-taupe-400/50 fixed top-1/2 left-1/2 w-[80vw] -translate-x-1/2 rounded-lg px-6 py-8 shadow-lg shadow-gray-300/20 backdrop-blur-sm"
			closedby={closeOnEscape ? "any" : "none"}
			onClose={onClose}
		>
			{children}
		</dialog>
	);
}
