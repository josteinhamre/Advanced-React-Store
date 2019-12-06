function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    // Simulate an API
    setTimeout(() => resolve(this.foods), 2000);
  });
};

describe('mocking learning', () => {
  it('mocks a reg function', () => {
    const fetchDogs = jest.fn();
    fetchDogs();
    fetchDogs('snickers');
    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith('snickers');
    expect(fetchDogs).toHaveBeenCalledTimes(2);
  });

  it('can create a person', () => {
    const me = new Person('Jostein', ['taco', 'burger', 'pancaces']);
    expect(me.name).toBe('Jostein');
  });

  it('can fetch foods', async () => {
    const me = new Person('Jostein', ['taco', 'burger', 'pancaces']);
    // Mock fetchFavFoods function
    me.fetchFavFoods = jest
      .fn()
      .mockResolvedValue(['taco', 'burger', 'pancaces']);
    const favFoods = await me.fetchFavFoods();
    expect(favFoods).toContain('taco');
  });
});
