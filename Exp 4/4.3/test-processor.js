module.exports = {
  generateRandomSeat,
  generateRandomUser
};

function generateRandomSeat(context, events, done) {
  // Generate a random seat number between 1 and 100
  context.vars.seatNumber = Math.floor(Math.random() * 100) + 1;
  return done();
}

function generateRandomUser(context, events, done) {
  // Generate a random user ID
  context.vars.userId = `user_${Math.floor(Math.random() * 1000) + 1}`;
  return done();
}
