import { shallow } from 'enzyme';
import ItemComponent from '../components/Item';

const fakeItem = {
  id: 'ABC123',
  title: 'A Cool Item',
  price: 5000,
  description: 'This item is really cool!',
  image: 'dog.jpg',
  largeImage: 'largedog.jpg',
};

describe('<Item />', () => {
  const wrapper = shallow(<ItemComponent item={fakeItem} />);
  console.log(wrapper.debug());

  it('renders images properly', () => {
    const image = wrapper.find('img');
    expect(image.props().src).toBe(fakeItem.image);
    expect(image.props().alt).toBe(fakeItem.title);
  });

  it('renders the pricetag and title properly', () => {
    expect(
      wrapper
        .find('PriceTag')
        .children()
        .text()
    ).toBe('$50');
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  });

  it('renders the description properly', () => {
    expect(
      wrapper
        .find('p')
        .children()
        .text()
    ).toBe(fakeItem.description);
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  });

  it('renders the buttons properly', () => {
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link').exists()).toBe(true);
    expect(buttonList.find('AddToCart').exists()).toBe(true);
    expect(buttonList.find('DeleteItem').exists()).toBe(true);
  });
});
