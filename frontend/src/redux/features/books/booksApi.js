import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseURL'
import { ADMIN_TOKEN_KEY, USER_TOKEN_KEY } from '../../../utils/authStorage'
const  baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/books`,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token =  localStorage.getItem(USER_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
        if(token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
})
const booksApi = createApi({
    reducerPath: 'booksApi',
        baseQuery,
          tagTypes: ['Books'],
          endpoints: (builder) =>({
        fetchAllBooks: builder.query({
            query: () => "/",
            providesTags: ["Books"]
        }),
        fetchBookById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Books", id }],
        }), 
         addBook: builder.mutation({
            query: (newBook) => ({
                url: `/create-book`,
                method: "POST",
                body: newBook
            }),
              invalidatesTags: ["Books"]
                }),
        updateBook: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/edit/${id}`,
                method: "PUT",
                body: rest,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags: ["Books"]
        }),
	     deleteBook: builder.mutation({
	            query: (id) => ({
	                url: `/delete/${id}`,
	                method: "DELETE"
	            }),
	            invalidatesTags: ["Books"]
	        })

})
})

export const {useFetchAllBooksQuery, useFetchBookByIdQuery, useAddBookMutation, useUpdateBookMutation, useDeleteBookMutation} = booksApi;

export default booksApi;
