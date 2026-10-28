import { Link } from "react-router";
import { useCreateStudentMutation, useGetStudentsQuery } from "../../services/students.api";
import StudentCard from "../components/StudentCard";
import Modal from "../components/Modal";
import { useState } from "react";
import Input from "../components/Input";

export default function Students() {
	const {
		data: students,
		isSuccess,
		isFetching,
		isError,
	} = useGetStudentsQuery(
		{},
		{
			refetchOnMountOrArgChange: true,
		},
	);

  const [modalState, setModalState] = useState(false);
  const [createStudent, {isLoading: isCreating}] = useCreateStudentMutation();

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [matricule, setMatricule] = useState('')

	return (
    <>
      <div>
        <section>
          <div className="grid w-full gap-4 px-4 sm:gap-6 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full">
              <button type="button" role="button" className="add-student-button float-right rounded bg-green-300 px-3 py-1.5" onClick={() => setModalState(true)}>Add Student</button>
            </div>
            {isFetching ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  className="bg-taupe-600/30 border-taupe-400 h-60 animate-pulse rounded-lg border"
                  key={i}
                ></div>
              ))
            ) : isSuccess ? (
                students.map((student) => (
                  <Link
                    to={{ pathname: `/students/${student.id}` }}
                    key={student.id}
                  >
                    <StudentCard student={student} />
                  </Link>
                ))
              ) : isError ? (
                  <div className="col-span-full py-2 text-red-400"></div>
                ) : null}
          </div>
        </section>
      </div>

      <Modal open={modalState} closeOnEscape>
				<form className="">
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-2">
							<Input
								value={firstName}
								onChange={(e) =>
									setFirstName(e.target.value)
								}
								placeholder="First name"
                name="first_name"
							/>
							<Input
								value={lastName}
								onChange={(e) =>
									setLastName(e.target.value)
								}
								placeholder="Last name"
                name="last_name"
							/>
						</div>
						<Input
							placeholder="Matricule"
							value={matricule}
							onChange={(e) =>
									setMatricule(e.target.value)
							}
              name="matricule"
						/>
					</div>

					<button type="submit" className="cursor-pointer bg-teal-400 px-3 py-1.5" id="#add-student-btn" onClick={() => {
            createStudent({id: crypto.randomUUID(), first_name: firstName, last_name: lastName, matricule}).then(() => setModalState(false))
          }} disabled={isCreating}>
						Add Student
					</button>
				</form>
      </Modal>
    </>
	);
}
