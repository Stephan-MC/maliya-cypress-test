import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
    useDeleteStudentMutation,
	useGetStudentQuery,
	useUpdateStudentMutation,
} from "../../services/students.api";
import type { Student as StudentModel } from "../../types/student";
import Input from "../components/Input";
import Modal from "../components/Modal";

export default function Student() {
	const { id } = useParams();

	const {
		data: student,
		isFetching,
		isSuccess,
		isError,
	} = useGetStudentQuery(String(id));

	const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
  const [deleteStudent, { isLoading: isDeletingStudent }] = useDeleteStudentMutation()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [matricule, setMatricule] = useState("")

  useEffect(() => {
    if (!!student ) {
      setFirstName(student.first_name)
      setLastName(student.last_name)
      setMatricule(student.matricule)

    }
  }, [student])

  const handleStudentDelete = () => {
    if (confirm(`Are you sure you want to delete "${student?.first_name} ${student?.last_name}"`)) {
      deleteStudent(student!.id).then(() => console.log('Deleted'));
    }
  }


	const [dialogState, setDialogState] = useState(false);

	return (
		<div className="px-6">
			<div className="aspect-3/4 w-full rounded-lg p-2 px-4">
				{isFetching ? (
					<>
						<div className="aspect-square size-50 animate-pulse rounded-full border-4 border-gray-400/20 bg-slate-700"></div>
						<div className="mt-4 grid grid-cols-[1fr_2.5fr] gap-x-2 gap-y-4 *:h-7 *:animate-pulse *:rounded *:bg-gray-200">
							<span className=""> </span>
							<span className=""></span>

							<span></span>
							<span></span>

							<span></span>
							<span></span>
						</div>
					</>
				) : isSuccess && !!student ? (
					<>
						<div className="aspect-square size-50 rounded-full border-4 border-gray-400/20 bg-slate-700"></div>
						<div className="mt-4 grid grid-cols-[1fr_2.5fr]">
							<span>ID: </span>
							<span className="line-clamp-1">{student.id}</span>

							<span>Name: </span>
							<span>
								{student.first_name} {student.last_name}
							</span>

							<span>Matricule: </span>
							<span>{student.matricule}</span>
						</div>

            <div className="mt-8 flex gap-2 *:cursor-pointer *:rounded-lg *:px-3 *:py-1.5">
                <button type="button" className="bg-green-400 disabled:grayscale-30"  onClick={() => setDialogState(true)} disabled={!student}>Edit</button>
                <button type="button"  className="bg-red-400 disabled:grayscale-30" onClick={() => handleStudentDelete()} disabled={!student}>Delete</button>
              </div>
					</>
				) : null}
			</div>
			<Modal open={dialogState} onClose={() => setDialogState(false)}>
				<div className="">
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-2">
							<Input
								value={firstName}
								onChange={(e) =>
									setFirstName(e.target.value)
								}
								placeholder="First name"
							/>
							<Input
								value={lastName}
								onChange={(e) =>
									setLastName(e.target.value)
								}
								placeholder="Last name"
							/>
						</div>
						<Input
							placeholder="Matricule"
							value={matricule}
							onChange={(e) =>
									setMatricule(e.target.value)
							}
						/>
					</div>

					<button type="button" className="cursor-pointer bg-teal-400 px-3 py-1.5" onClick={() => {
            updateStudent({id: String(student?.id), first_name: firstName, last_name: lastName, matricule}).then(() => setDialogState(false))
          }} disabled={isUpdating}>
						Update Student
					</button>
				</div>
			</Modal>
		</div>
	);
}
