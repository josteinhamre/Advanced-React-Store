import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';
import { perPage } from '../config';
import Error from './ErrorMessage';
import PaginationStyles from './styles/PaginationStyles';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <Error error={error} />;
      const { count } = data.itemsConnection.aggregate;
      const pages = Math.ceil(count / perPage);
      const { page } = props;
      return (
        <PaginationStyles data-test="pagination">
          <Head>
            <title>
              Sick Fits! Page {page} of {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page - 1 },
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              ←
            </a>
          </Link>
          <p>
            Page {page} of {pages}
          </p>
          <p>{count} items total</p>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page + 1 },
            }}
          >
            <a className="next" aria-disabled={page >= pages}>
              →
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
export { PAGINATION_QUERY };
