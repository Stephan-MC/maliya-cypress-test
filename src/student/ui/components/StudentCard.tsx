import type { Student } from "@/types/student";

export default function StudentCard(props: { student: Student }) {
	const { student } = props;

	return (
		<div className="border border-taupe-400 hover:shadow shadow-taupe-300 shadow-lg hover:scale-102 rounded-lg p-2 px-4 aspect-video bg-radial from-taupe-400/50 from-5% via-yellow-700/30 to-taupe-600/20 transition duration-300 ease-out">
			<div className="rounded-full aspect-square size-20 bg-slate-700 border-4 border-gray-400/20"></div>
			<div className="grid grid-cols-[1fr_2.5fr] mt-4">
				<span>ID: </span>
				<span className="line-clamp-1">{student.id}</span>

				<span>Name: </span>
				<span>
					{student.first_name} {student.last_name}
				</span>

				<span>Matricule: </span>
				<span>{student.matricule}</span>
			</div>
		</div>
	);
}
