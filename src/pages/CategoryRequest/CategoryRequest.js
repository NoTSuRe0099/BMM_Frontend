import React from 'react';
import Header from '../../components/Header';
import { useQuery } from 'react-query';
import { userRequest } from '../../requestMethods';
import Loading from '../Loading';
import CategoryRequestTableRow from './CategoryRequestTableRow';
import { useSelector } from 'react-redux';

const CategoryRequest = () => {
  const user = useSelector((state) => state?.user?.currentUser?.user);
  const {
    isLoading,
    error,
    data: requests,
    isFetching,
    refetch,
  } = useQuery(
    'requests',
    async () => await userRequest.get('/categoryrequest')
  );

  const {
    isLoading: wholesellerRequestsLoading,
    data: wholesellerRequests,
    refetch: wholesellerRequestsFetch,
  } = useQuery(
    'wholesellerRequests',
    async () =>
      await userRequest.get(`/categoryrequest/wholeseller/${user?._id}`)
  );

  //Delete Category Request Wholeseller
  const handleDeleteCategoryReq = (id) => {
    const confirmDelete = window.confirm('Are you Sure?');
    if (confirmDelete) {
      const url = `/categoryrequest/${id}`;
      userRequest.delete(url);
    }
    refetch();
  };

  // console.log(wholesellerRequests);

  if (isLoading) {
    return <Loading></Loading>;
  }

  // console.log(requests);

  return (
    <div className="container mx-auto max-w-[95%]">
      <Header category="Page" title="Category Requests" />

      {user?.role == 'admin' && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>SL</th>
                <th>Wholeseller</th>
                <th>Wholeseller Email</th>
                <th>Requested Categories</th>
                <th>Request Status</th>
                <th>Manage Request</th>
                <th>Delete Request</th>
              </tr>
            </thead>
            <tbody>
              {requests?.data?.map((requestItem, index) => (
                <CategoryRequestTableRow
                  key={requestItem._id}
                  requestItem={requestItem}
                  index={index}
                  refetch={refetch}
                ></CategoryRequestTableRow>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {user?.role == 'wholeseller' && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>SL</th>
                <th>Wholeseller</th>
                <th>Requested Categories</th>
                <th>Request Status</th>
                <th>Delete Request</th>
              </tr>
            </thead>
            <tbody>
              {wholesellerRequests?.data?.categories?.length > 0 ? (
                <tr>
                  <td>1</td>
                  <td>{user?.name}</td>
                  <td>
                    {wholesellerRequests?.data?.categories?.map(
                      (category, index) => (
                        <p key={index} className="badge badge-info gap-2">
                          {category.categoryName}
                        </p>
                      )
                    )}
                  </td>
                  <td>{wholesellerRequests?.data?.status}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleDeleteCategoryReq(wholesellerRequests?.data?._id)
                      }
                      className="btn btn-primary btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <th>
                    {' '}
                    <p className="text-red-500"> No Requests! </p>
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryRequest;
