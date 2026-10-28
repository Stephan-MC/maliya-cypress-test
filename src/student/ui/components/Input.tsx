interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({type, value, placeholder, onChange, defaultValue, ...props}: InputProps) {
	return (
		<div className="focus-within:border-taupe-500 hover:border-taupe-400 rounded-lg border border-gray-300 px-2 py-1 transition-colors duration-150">
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				defaultValue={defaultValue}
				className="w-full focus:outline-none"
        {...props}
			/>
		</div>
	);
}
