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

  // it('creates a order token', async () => {
  //   const createOrderMock = jest.fn().mockResolvedValue({
  //     data: { createOrder: { id: 'xyz789' } },
  //   });
  //   const wrapper = mount(
  //     <MockedProvider mocks={mocks}>
  //       <OrderComponent id="abc123" />
  //     </MockedProvider>
  //   );
  //   const component = wrapper.find('Order').instance();
  //   component.onToken({ id: 'abc123' }, createOrderMock);
  //   expect(createOrderMock).toHaveBeenCalled();
  //   expect(createOrderMock).toHaveBeenCalledWith({
  //     variables: { token: 'abc123' },
  //   });
  // });
  // it('turnes the progressbar on', async () => {
  //   const createOrderMock = jest.fn().mockResolvedValue({
  //     data: { createOrder: { id: 'xyz789' } },
  //   });
  //   const wrapper = mount(
  //     <MockedProvider mocks={mocks}>
  //       <OrderComponent id="abc123" />;
  //     </MockedProvider>
  //   );
  //   await wait();
  //   wrapper.update();
  //   NProgress.start = jest.fn();
  //   const component = wrapper.find('Order').instance();
  //   component.onToken({ id: 'abc123' }, createOrderMock);
  //   expect(NProgress.start).toHaveBeenCalled();
  // });
  // it('routes to the order page when completed', async () => {
  //   const createOrderMock = jest.fn().mockResolvedValue({
  //     data: { createOrder: { id: 'xyz789' } },
  //   });
  //   const wrapper = mount(
  //     <MockedProvider mocks={mocks}>
  //       <OrderComponent id="abc123" />;
  //     </MockedProvider>
  //   );
  //   await wait();
  //   wrapper.update();
  //   Router.router.push = jest.fn();
  //   const component = wrapper.find('Order').instance();
  //   component.onToken({ id: 'abc123' }, createOrderMock);
  //   await wait();
  //   expect(Router.router.push).toHaveBeenCalled();
  //   expect(Router.router.push).toHaveBeenCalledWith({
  //     pathname: '/order',
  //     query: { id: 'xyz789' },
  //   });
  // });
});
