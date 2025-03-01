type PopupProps = {
	message: string;
};

export const Popup = ({ message }: PopupProps) => {
	return (
		<div className={`popup ${message}`}>
			<p>{message}</p>
		</div>
	);
};
