import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import NProgress from 'nprogress';
import Router from 'next/router';
import OrderComponent, { SINGLE_ORDER_QUERY } from '../components/Order';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeOrder } from '../lib/testUtils';

Router.router = { push() {} };

const mocks = [
  {
    request: { query: SINGLE_ORDER_QUERY, variables: { id: 'ord123' } },
    result: {
      data: {
        order: fakeOrder(),
      },
    },
  },
];

describe('<Order />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <OrderComponent id="ord123" />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find('div[data-test="order"]'))).toMatchSnapshot();
  });
});
