import faker from 'faker';

exports.fakeResult = function () {
  return {
    title: faker.company.companyName(),
    review: parseFloat((Math.random() * 5).toFixed(1)),
    totalReviews: Math.round(Math.random() * 100),
    type: faker.commerce.department(),
    address: faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.zipCode()+ ", " + faker.address.state() + ", " + faker.address.country(),
    open: (Math.random() * 12).toFixed(0) + ":00 PM",
    picture: faker.image.image(160, 160, true),
    description: faker.lorem.sentences(2),
    phone: faker.phone.phoneNumber()
  }
}
