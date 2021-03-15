import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../firebase';
import 'firebase/firestore';
import { useTable, useSortBy } from 'react-table';
import { orderDetailsMapper } from '../utils/mappers.js';
import arrowIcon from '../assets/arrow.svg';
import Cookie from 'js-cookie';

const Profile = ({ customerData, setCustomerAccessToken }) => {
    const history = useHistory();
    const columns = useMemo(
        () => [
            {
                Header: 'Order number',
                accessor: 'number',
            },
            {
                Header: 'Order price',
                accessor: 'price',
            },
            {
                Header: 'Order date',
                accessor: 'date',
            },
        ],
        []
    );
    const data = React.useMemo(() => orderDetailsMapper(customerData.orders), [
        customerData.orders,
    ]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
        },
        useSortBy
    );

    const handleLogout = () => {
        Cookie.remove('_session_digest');
        firebase
            .auth()
            .signOut()
            .then(() => {
                setCustomerAccessToken(null);
                history.push('/auth');
            });
    };

    return (
        <div className="profile">
            <div className="profile-body">
                <div>
                    <div className="profile-header">
                        <h2 className="profile-account">My Account</h2>
                        <button
                            className="logout button"
                            onClick={handleLogout}
                        >
                            Log out
                        </button>
                    </div>
                    <hr className="profile-divider" />
                    <div className="profile-account-body">
                        <div className="profile-order-history-table">
                            <div className="profile-label">Order History</div>
                            {data.length ? (
                                <table
                                    className="profile-orders-table"
                                    {...getTableProps()}
                                >
                                    <thead className="profile-table-header">
                                        {headerGroups.map((headerGroup) => (
                                            <tr
                                                {...headerGroup.getHeaderGroupProps()}
                                            >
                                                {headerGroup.headers.map(
                                                    (column) => (
                                                        // Add the sorting props to control sorting. For this example
                                                        // we can add them into the header props
                                                        <th
                                                            className="order-table-header"
                                                            {...column.getHeaderProps(
                                                                column.getSortByToggleProps()
                                                            )}
                                                        >
                                                            {column.render(
                                                                'Header'
                                                            )}
                                                            {/* Add a sort direction indicator */}
                                                            <span>
                                                                {column.isSorted ? (
                                                                    column.isSortedDesc ? (
                                                                        <img
                                                                            className="arrow-icon"
                                                                            src={
                                                                                arrowIcon
                                                                            }
                                                                            alt="arrow-icon"
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            className="arrow-down arrow-icon"
                                                                            src={
                                                                                arrowIcon
                                                                            }
                                                                            alt="arrow-icon"
                                                                        />
                                                                    )
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </span>
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody {...getTableBodyProps()}>
                                        {rows.map((row, i) => {
                                            prepareRow(row);
                                            return (
                                                <tr {...row.getRowProps()}>
                                                    {row.cells.map((cell) => {
                                                        return (
                                                            <td
                                                                className="orders-table-data"
                                                                {...cell.getCellProps()}
                                                            >
                                                                {cell.render(
                                                                    'Cell'
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="profile-no-orders">
                                    You have not made any order yet.
                                </p>
                            )}
                        </div>
                        <div className="profile-account-details">
                            <div className="profile-label">Account Details</div>
                            <div className="details">
                                <p className="details-text">
                                    Name: {`${customerData.displayName}`}
                                </p>
                                <p className="details-text">
                                    Phone: {`${customerData.phone}`}
                                </p>
                                {customerData.defaultAddress ? (
                                    <p className="details-text">
                                        Address:{' '}
                                        {`${customerData.defaultAddress.address1}`}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
