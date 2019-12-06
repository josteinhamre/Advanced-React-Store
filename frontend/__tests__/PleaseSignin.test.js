import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { CURRENT_USER_QUERY } from '../components/User';
import PleaseSignInComponent from '../components/PleaseSignIn';
import { fakeUser } from '../lib/testUtils';

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

describe('<PleaseSignin />', () => {
  it('renders the sign in dialog to logged out users', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignInComponent />
      </MockedProvider>
    );

    expect(wrapper.text()).toContain('Loading...');
    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find('p'))).toMatchSnapshot();
    expect(toJSON(wrapper.find('fieldset'))).toMatchSnapshot();
  });

  it('renders the child component when the user is signed in', async () => {
    const Hey = () => <p>Hey</p>;
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignInComponent>
          <Hey />
        </PleaseSignInComponent>
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(wrapper.find('Hey').exists()).toBe(true);
    expect(wrapper.contains(<Hey />)).toBe(true);
  });
});
