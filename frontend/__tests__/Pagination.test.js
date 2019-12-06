import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import PaginationComponent, {
  PAGINATION_QUERY,
} from '../components/Pagination';

Router.router = {
  push() {},
  prefetch() {},
};

function makeMocksFor(length) {
  return [
    {
      request: { query: PAGINATION_QUERY },
      result: {
        data: {
          itemsConnection: {
            aggregate: {
              count: length,
              __typename: 'count',
            },
            __typename: 'aggregate',
          },
        },
      },
    },
  ];
}

describe('<Pagination />', () => {
  it('displays a loading message', () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(1)}>
        <PaginationComponent page={1} />
      </MockedProvider>
    );

    expect(wrapper.text()).toContain('Loading...');
  });

  it('renders pagination for 18 items', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <PaginationComponent page={1} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    const pagination = wrapper.find('div[data-test="pagination"]');
    // console.log(pagination.debug({ verbose: false }));
    expect(toJSON(pagination)).toMatchSnapshot();
  });

  it('disables the prev button on first page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <PaginationComponent page={1} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(true);
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);
  });

  it('disables the next button on last page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <PaginationComponent page={5} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(true);
  });

  it('enables all buttons on the middle page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <PaginationComponent page={3} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
  });
});
