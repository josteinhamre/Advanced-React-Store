import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { CURRENT_USER_QUERY } from '../components/User';
import NavComponent from '../components/Nav';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

const notSignedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me: null,
      },
    },
  },
];

const signedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me: fakeUser(),
      },
    },
  },
];

const signedInMocksWithCartItems = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [
            fakeCartItem(),
            fakeCartItem(),
            fakeCartItem(),
            fakeCartItem(),
          ],
        },
      },
    },
  },
];

describe('<Nav />', () => {
  it('renders a minimal Nav when signed out', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <NavComponent />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    const nav = wrapper.find('ul[data-test="nav"]');
    // console.log(nav.debug());
    expect(toJSON(nav)).toMatchSnapshot();
  });

  it('renders a ful Nav when signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <NavComponent />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    const nav = wrapper.find('ul[data-test="nav"]');
    const aTags = nav.find('a');
    expect(nav.children().length).toBe(6);
    expect(nav.text()).toContain('Sign Out');
    expect(toJSON(aTags)).toMatchSnapshot();
  });

  it('renders the amount of items in the cart', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocksWithCartItems}>
        <NavComponent />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    const count = wrapper.find('div.count');
    expect(toJSON(count)).toMatchSnapshot();
  });
});
