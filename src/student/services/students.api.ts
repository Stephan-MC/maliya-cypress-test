import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type Student } from "../../types/student";

const studentApi = createApi({
	reducerPath: "students",
	baseQuery: async (args, api, extraOptions) => {
		// 1. If args is a plain string, convert it to an object so we can read/modify the URL
		const adjustedArgs = typeof args === "string" ? { url: args } : { ...args };

		return await fetchBaseQuery({ baseUrl: process.env.BUN_PUBLIC_API_URL })(
			adjustedArgs,
			api,
			extraOptions,
		);
	},
	// baseQuery: fetchBaseQuery({ baseUrl: process.env.BUN_PUBLIC_API_URL }),
	tagTypes: ["Student"],
	endpoints: (builder) => ({
		getStudents: builder.query<
			Array<Student>,
			Record<string, string | number | boolean> | undefined
		>({
			query: (params = {}) => ({
				url: "/students",
				params,
			}),
			transformResponse: async (res: Array<Student>) => {
				return new Promise((resolve) => setTimeout(resolve, 600)).then(
					() => res,
				);
			},
			providesTags: (result, error) =>
				result
					? result.map(({ id }) => ({ type: "Student", id }))
					: ["Student"],
		}),
		getStudent: builder.query<Student, Pick<Student, "id">>({
			query: (id) => ({
				url: `/students/${id}`,
			}),
			providesTags: (result, error, id) => [{ type: "Student", id }],
		}),
		createStudent: builder.mutation<void, Omit<Student, "id">>({
			query: (data) => ({
				url: `/students/`,
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["Student"],
		}),
		updateStudent: builder.mutation<void, Student>({
			query: ({ id, ...body }) => ({
				url: `/students/${id}`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: ["Student"],
		}),
		deleteStudent: builder.mutation<void, Pick<Student, "id">>({
			query: (id) => ({
				url: `/students/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Student"],
		}),
	}),
});

export const {
	useGetStudentQuery,
	useCreateStudentMutation,
	useGetStudentsQuery,
	useDeleteStudentMutation,
	useUpdateStudentMutation,
} = studentApi;
export { studentApi };
