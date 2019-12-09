import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import CartCountComponent from '../components/CartCount';

const fakeItem = {
  id: 'ABC123',
  title: 'A Cool Item',
  price: 4000,
  description: 'This item is really cool!',
  image: 'dog.jpg',
  largeImage: 'largedog.jpg',
};

describe('<CartCount />', () => {
  it('renders', () => {
    shallow(<CartCountComponent count={10} />);
  });

  it('matches the snapshot', () => {
    const wrapper = shallow(<CartCountComponent count={10} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('updates via props', () => {
    const wrapper = shallow(<CartCountComponent count={50} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.setProps({ count: 10 });
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
